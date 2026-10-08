"""Aviation ops: a narrow-body turnaround on the apron in front of an MRO hangar.

Builds the SCENE collection, which export.py writes:
  SCENE   the apron (one slab with the stand and road markings), the aircraft
          on its stand nose to +x, the ground equipment on its near side (belt
          loader at the forward hold, a train of baggage carts, catering truck
          at the aft door, GPU, pushback tug at the nose), and along the far
          side the open front of a maintenance hangar: back and side wall, the
          door header, the stacked doors, an engine on its stand with a work
          stand beside it, a parts rack; ULD containers on dollies past its end

Outdoors, so there is no hall: the slab is still named `hall_floor` and the
hangar's walls `hall_wall_*`, so the page lands them first. The fuselage runs
along x at y = FUSE_Y; the free lanes run along x too (the page's routes in
src/lib/verticals.ts use the same metres, with z = -y):
  y = -15.5   the service road (tugs)
  y = -13     the walkway between the cart train and the road
  y = +7      the taxi line behind the aircraft, under the wing tips (tugs)
  y = +10.5   inside the hangar door, in front of the work stand
"""
exec(compile(open(f"{KIT}/props.py").read(), "props.py", "exec"))

SC = "SCENE"
FUSE_Y = -2.0      # the aircraft's centreline
FUSE_Z = 3.55      # its axis height; radius FUSE_R puts the belly at 1.65
FUSE_R = 1.9
WING_Z = 2.4
HANGAR_Y = 8.6     # the door line
BACK_Y = 17.4
SIDE_X = -24.4
HANGAR_X1 = 8.0    # the hangar's open end
H = 10.5           # hangar wall height


# --- builders the kit does not have --------------------------------------------
def loft(name, rings, loc=(0, 0, 0), segments=20, cname=SC):
    """A body of revolution along x through rings (x, z_centre, radius), with
    capped ends: the fuselage, nacelles, cones. One mesh."""
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    loops = []
    for x, zc, r in rings:
        loops.append([bm.verts.new((x, r * math.cos(2 * math.pi * i / segments),
                                    zc + r * math.sin(2 * math.pi * i / segments)))
                      for i in range(segments)])
    for a, b in zip(loops, loops[1:]):
        for i in range(segments):
            j = (i + 1) % segments
            bm.faces.new((a[i], a[j], b[j], b[i]))
    bm.faces.new(list(reversed(loops[0])))
    bm.faces.new(loops[-1])
    for f in bm.faces:
        f.smooth = len(f.verts) == 4    # round along the body, flat on the caps
    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()
    return _finish(mesh, name, loc, (0, 0, 0), cname)


def prism(name, pts, thick, plane="xy", loc=(0, 0, 0), rot=(0, 0, 0), cname=SC):
    """A flat outline extruded: wings and stabilisers (plane xy, thickness in
    z), the fin (plane xz, thickness in y), a ULD's contour (plane yz)."""
    def place3(u, v, w):
        if plane == "xy":
            return (u, v, w)
        if plane == "xz":
            return (u, w, v)
        return (w, u, v)  # yz
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    lo = [bm.verts.new(place3(u, v, -thick / 2)) for u, v in pts]
    hi = [bm.verts.new(place3(u, v, thick / 2)) for u, v in pts]
    n = len(pts)
    bm.faces.new(list(reversed(lo)))
    bm.faces.new(hi)
    for i in range(n):
        j = (i + 1) % n
        bm.faces.new((lo[i], lo[j], hi[j], hi[i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()
    return _finish(mesh, name, loc, rot, cname)


def wheels(name, centres, r, w, fill="steel_dk", segments=12):
    """Several wheels (axis along y) welded into one mesh."""
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    for c in centres:
        res = bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=segments,
                                    radius1=r, radius2=r, depth=w)
        bmesh.ops.rotate(bm, verts=res["verts"], cent=(0, 0, 0),
                         matrix=Euler((math.pi / 2, 0, 0)).to_matrix())
        bmesh.ops.translate(bm, verts=res["verts"], vec=Vector(c))
    bm.to_mesh(mesh)
    bm.free()
    o = _finish(mesh, name, (0, 0, 0), (0, 0, 0), SC)
    styled(o, fill)
    return o


def cones(name, spots):
    """Safety cones round the aircraft, one mesh: base plate and cone."""
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    for x, y in spots:
        res = bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=10,
                                    radius1=0.24, radius2=0.04, depth=0.75)
        bmesh.ops.translate(bm, verts=res["verts"], vec=Vector((x, y, 0.42)))
        res = bmesh.ops.create_cube(bm, size=1.0)
        bmesh.ops.scale(bm, vec=Vector((0.5, 0.5, 0.06)), verts=res["verts"])
        bmesh.ops.translate(bm, verts=res["verts"], vec=Vector((x, y, 0.03)))
    bm.to_mesh(mesh)
    bm.free()
    o = _finish(mesh, name, (0, 0, 0), (0, 0, 0), SC)
    styled(o, "orange_lt")
    return o


def bags(name, n, length, width, seed, z0=0.0, loc=(0, 0, 0), rot=(0, 0, 0)):
    """Baggage piled on a bed, in the three warm fills (one object each).
    Deterministic: the same seed lays the same pile."""
    fills = ("orange", "orange_lt", "brown")
    piles = {f: [] for f in fills}
    cols = max(1, int(length / 0.62))
    rows = max(1, int(width / 0.5))
    k = seed
    for i in range(n):
        k = (k * 1103515245 + 12345) & 0x7FFFFFFF
        c, r, lv = i % cols, (i // cols) % rows, i // (cols * rows)
        sx = 0.52 + (k % 5) * 0.03
        sy = 0.34 + (k % 3) * 0.04
        sz = 0.26 + (k % 4) * 0.04
        px = -length / 2 + (c + 0.5) * length / cols + ((k >> 4) % 5 - 2) * 0.02
        py = -width / 2 + (r + 0.5) * width / rows
        piles[fills[(k >> 7) % 3]].append(((sx, sy, sz), (px, py, z0 + lv * 0.34 + sz / 2),
                                           (0, 0, ((k >> 9) % 7 - 3) * 0.05)))
    for f, boxes in piles.items():
        if boxes:
            styled(parts("%s_load_%s" % (name, f), boxes, loc=loc, rot=rot, cname=SC), f)


# --- the apron -------------------------------------------------------------------
floor = cube("hall_floor", (50.0, 36.0, 0.22), loc=(0, 0, -0.11), cname=SC)
styled(floor, "paper_dk")


def line(name, a, b, w=0.16):
    """A painted line from a to b (axis-aligned)."""
    (x0, y0), (x1, y1) = a, b
    o = cube("lane_%s" % name, (abs(x1 - x0) + w, abs(y1 - y0) + w, 0.03),
             loc=((x0 + x1) / 2, (y0 + y1) / 2, 0.015), cname=SC)
    styled(o, "hivis")


def dashes(name, y, x0, x1, dash=1.6, gap=1.2, w=0.14):
    boxes = []
    x = x0
    while x + dash <= x1:
        boxes.append(((dash, w, 0.03), (x + dash / 2, 0, 0)))
        x += dash + gap
    styled(parts("lane_%s" % name, boxes, loc=(0, y, 0.015), cname=SC), "hivis")


line("taxi", (-24.5, 7.0), (24.5, 7.0), w=0.22)                # taxi centreline
line("leadin", (-14.0, FUSE_Y), (21.5, FUSE_Y))                 # stand lead-in
line("leadin_turn", (21.5, FUSE_Y), (21.5, 7.0))               # its turn off the taxi line
line("stop", (13.0, FUSE_Y - 1.4), (13.0, FUSE_Y + 1.4), w=0.4)  # nose-wheel stop bar
line("road_a", (-24.5, -14.2), (24.5, -14.2))                  # service road edges
line("road_b", (-24.5, -16.8), (24.5, -16.8))
dashes("road_mid", -15.5, -24.0, 24.5)
# equipment restraint box round the stand, a dashed line either end
for i, x in enumerate((-18.0, 23.0)):
    styled(parts("lane_era_%d" % i, [((0.14, 1.6, 0.03), (0, -12.5 + j * 2.8, 0))
                                     for j in range(7)], loc=(x, 0, 0.015), cname=SC), "hivis")
line("threshold", (SIDE_X, HANGAR_Y - 0.3), (HANGAR_X1, HANGAR_Y - 0.3), w=0.3)  # door rail


# --- the aircraft ----------------------------------------------------------------
fuse = loft("aircraft_fuselage", [
    (15.6, 3.20, 0.08),
    (15.3, 3.24, 0.70),
    (14.6, 3.32, 1.25),
    (13.5, 3.45, 1.66),
    (12.0, FUSE_Z, FUSE_R),
    (-6.0, FUSE_Z, FUSE_R),
    (-9.5, 3.85, 1.50),
    (-12.5, 4.40, 0.85),
    (-14.2, 4.80, 0.28),
], loc=(0, FUSE_Y, 0), segments=24)
styled(fuse, "white")

# windscreen, cabin windows and doors on the near (-y) side; windscreen both sides
win = []
for s in (-1, 1):   # windscreen and the side window, tangent to the nose
    win.append(((0.72, 0.14, 0.5), (14.05, s * 1.15, 4.28), (s * math.radians(38), 0, 0)))
    win.append(((0.6, 0.14, 0.42), (13.3, s * 1.45, 4.32), (s * math.radians(30), 0, 0)))
for i in range(22):
    win.append(((0.26, 0.12, 0.30), (10.0 - i * 0.78, -1.84, 4.05)))
styled(parts("aircraft_windows", win, loc=(0, FUSE_Y, 0), cname=SC), "steel_dk")
doors = parts("aircraft_doors", [
    ((0.85, 0.1, 1.75), (11.3, -1.80, 3.55)),
    ((0.85, 0.1, 1.75), (-8.2, -1.58, 3.8)),
], loc=(0, FUSE_Y, 0), cname=SC)
styled(doors, "steel")
holds = parts("aircraft_holds", [
    ((1.5, 0.1, 1.0), (7.0, -1.46, 2.30)),
    ((1.5, 0.1, 1.0), (-4.5, -1.46, 2.30)),
], loc=(0, FUSE_Y, 0), cname=SC)
styled(holds, "steel_dk")
fairing = parts("aircraft_fairing", [((7.5, 3.0, 0.9), (0.4, 0, 1.95), (0, 0, 0), 0.3)],
                loc=(0, FUSE_Y, 0), cname=SC)
styled(fairing, "paper_dk")

# wings: swept planform, low on the fuselage, with dihedral and a winglet
WING = [(4.4, 0.0), (-2.6, 0.0), (-5.8, -9.6), (-3.7, -9.6)]
for s in (-1, 1):
    pts = [(x, s * y) for x, y in WING]
    w = prism("aircraft_wing_%d" % (s > 0), pts, 0.36, loc=(0, FUSE_Y + s * 1.4, WING_Z),
              rot=(math.radians(-6 if s < 0 else 6), 0, 0))
    styled(w, "white")
    tip = prism("aircraft_winglet_%d" % (s > 0), [(-3.6, 0), (-5.7, 0), (-6.3, 1.3), (-5.5, 1.3)],
                0.16, plane="xz", loc=(0, FUSE_Y + s * 11.0, WING_Z + 1.0))
    styled(tip, "white")

# engines under the wings: nacelle, dark intake, pylon
for s in (-1, 1):
    y = FUSE_Y + s * 4.9
    nac = loft("aircraft_engine_%d" % (s > 0), [
        (5.5, 1.75, 0.92), (5.2, 1.75, 1.0), (3.0, 1.75, 1.0), (2.0, 1.8, 0.78), (1.5, 1.85, 0.4),
    ], loc=(0, y, 0), segments=18)
    styled(nac, "steel")
    intake = disc("aircraft_intake_%d" % (s > 0), 0.82, loc=(5.53, y, 1.75),
                  rot=(0, math.pi / 2, 0), cname=SC, segments=18)
    styled(intake, "steel_dk")
    pylon = parts("aircraft_pylon_%d" % (s > 0), [((3.4, 0.3, 0.9), (2.8, 0, 2.7), (0, 0.12, 0))],
                  loc=(0, y, 0), cname=SC)
    styled(pylon, "white")

# tail: fin (with the livery's one stripe) and the two stabilisers
fin = prism("aircraft_fin", [(-9.6, 4.6), (-13.9, 4.6), (-15.6, 10.6), (-13.6, 10.6)],
            0.34, plane="xz", loc=(0, FUSE_Y, 0))
styled(fin, "white")
stripe = prism("aircraft_livery", [(-12.2, 7.0), (-14.6, 7.0), (-15.4, 9.6), (-13.3, 9.6)],
               0.40, plane="xz", loc=(0, FUSE_Y, 0))
styled(stripe, "orange")
for s in (-1, 1):
    st = prism("aircraft_stab_%d" % (s > 0),
               [(-11.0, 0.0), (-13.6, 0.0), (-15.0, s * 4.6), (-13.9, s * 4.6)],
               0.22, loc=(0, FUSE_Y + s * 0.5, 4.85))
    styled(st, "white")

# landing gear: nose gear and two main legs, struts and wheels
gear = parts("aircraft_gear", [
    ((0.18, 0.18, 1.6), (12.2, 0, 1.25)),
    ((0.16, 0.16, 1.6), (-0.6, -2.5, 1.2)),
    ((0.16, 0.16, 1.6), (-0.6, 2.5, 1.2)),
    ((0.9, 0.12, 0.12), (-0.6, -2.5, 0.62)),
    ((0.9, 0.12, 0.12), (-0.6, 2.5, 0.62)),
], loc=(0, FUSE_Y, 0), cname=SC)
styled(gear, "steel")
wheels("aircraft_wheels", [
    (12.2, FUSE_Y - 0.3, 0.42), (12.2, FUSE_Y + 0.3, 0.42),
    (-0.6, FUSE_Y - 2.2, 0.6), (-0.6, FUSE_Y - 2.8, 0.6),
    (-0.6, FUSE_Y + 2.2, 0.6), (-0.6, FUSE_Y + 2.8, 0.6),
], 0.42, 0.3)
for i, (x, y) in enumerate(((-0.6, FUSE_Y - 2.5), (12.2, FUSE_Y))):
    chock = parts("aircraft_chock_%d" % i, [((0.3, 1.2, 0.22), (-0.75, 0, 0.11)),
                                            ((0.3, 1.2, 0.22), (0.75, 0, 0.11))],
                  loc=(x, y, 0), cname=SC)
    styled(chock, "hivis")
cones("aircraft_cones", [(6.6, FUSE_Y - 4.9), (6.6, FUSE_Y + 4.9), (-6.6, FUSE_Y - 11.6),
                          (-6.6, FUSE_Y + 11.6), (-16.0, FUSE_Y), (17.2, FUSE_Y - 2.4)])


# --- ground support equipment -----------------------------------------------------
def belt_loader(name, x):
    """Belt loader at the forward hold: chassis, cab at the low end, the belt
    rising to the hold sill, bags riding up it."""
    y0, y1 = FUSE_Y - 7.3, FUSE_Y - 1.55          # belt from ground end to the sill
    z0, z1 = 0.95, 2.05
    L = math.hypot(y1 - y0, z1 - z0)
    ang = math.atan2(z1 - z0, y1 - y0)
    yc, zc = (y0 + y1) / 2, (z0 + z1) / 2
    chassis = parts("%s_chassis" % name, [
        ((1.7, 5.4, 0.45), (0, FUSE_Y - 5.6, 0.55)),
        ((0.25, 0.25, 0.9), (0, FUSE_Y - 4.0, 1.0)),
    ], loc=(x, 0, 0), cname=SC)
    styled(chassis, "steel_dk")
    wheels("%s_wheels" % name, [(x + sx * 0.8, FUSE_Y - 4.0 + d, 0.32)
                                for sx in (-1, 1) for d in (-0.2, -3.2)], 0.32, 0.22)
    cab = parts("%s_cab" % name, [((1.5, 1.1, 1.2), (0.0, FUSE_Y - 7.2, 1.35))],
                loc=(x + 1.6, 0, 0), cname=SC)
    styled(cab, "steel")
    roof = parts("%s_roof" % name, [((1.6, 1.2, 0.12), (0.0, FUSE_Y - 7.2, 2.0))],
                 loc=(x + 1.6, 0, 0), cname=SC)
    styled(roof, "orange_lt")
    belt = parts("%s_belt" % name, [((1.0, L, 0.16), (0, 0, 0))],
                 loc=(x, yc, zc), rot=(ang, 0, 0), cname=SC)
    styled(belt, "steel")
    rails = parts("%s_rails" % name, [((0.1, L, 0.26), (sx * 0.55, 0, 0.12)) for sx in (-1, 1)],
                  loc=(x, yc, zc), rot=(ang, 0, 0), cname=SC)
    styled(rails, "orange_lt")
    rider = [((0.56, 0.36, 0.3), (0, d, 0.23), (0, 0, 0.6)) for d in (-2.4, -0.5, 1.6)]
    styled(parts("%s_load_belt" % name, rider, loc=(x, yc, zc), rot=(ang, 0, 0), cname=SC),
           "orange")


belt_loader("belt", 7.0)


def cart(name, x, y, n, seed):
    """An open baggage cart: bed, low rails, four wheels, towbar, its bags."""
    frame = parts("%s_frame" % name, [
        ((3.0, 1.6, 0.12), (0, 0, 0.62)),
        ((3.0, 0.08, 0.4), (0, -0.78, 0.86)),
        ((3.0, 0.08, 0.4), (0, 0.78, 0.86)),
        ((0.08, 1.6, 0.4), (-1.46, 0, 0.86)),
        ((0.9, 0.08, 0.08), (1.9, 0, 0.45)),
    ], loc=(x, y, 0), cname=SC)
    styled(frame, "steel")
    wheels("%s_wheels" % name, [(x + dx, y + dy, 0.28) for dx in (-1.0, 1.0) for dy in (-0.6, 0.6)],
           0.28, 0.2)
    bags(name, n, 2.8, 1.4, seed, z0=0.68, loc=(x, y, 0))


CART_Y = -11.0
for i, (x, n) in enumerate(((-2.0, 10), (1.8, 13), (5.6, 8), (9.4, 12))):
    cart("cart_%d" % i, x, CART_Y, n, 7 + i * 31)

# the baggage tractor at the head of the train
tractor = parts("tractor_body", [
    ((2.6, 1.5, 0.7), (0, 0, 0.75)),
    ((1.0, 1.4, 0.12), (-0.5, 0, 2.15)),
    ((0.1, 0.1, 1.1), (-0.95, -0.65, 1.6)),
    ((0.1, 0.1, 1.1), (-0.95, 0.65, 1.6)),
    ((0.1, 0.1, 1.1), (-0.05, -0.65, 1.6)),
    ((0.1, 0.1, 1.1), (-0.05, 0.65, 1.6)),
], loc=(13.4, CART_Y, 0), cname=SC)
styled(tractor, "steel_dk")
styled(parts("tractor_trim", [((1.1, 1.45, 0.1), (-0.5, 0, 2.25))],
             loc=(13.4, CART_Y, 0), cname=SC), "orange_lt")
wheels("tractor_wheels", [(13.4 + dx, CART_Y + dy, 0.38) for dx in (-0.8, 0.8) for dy in (-0.7, 0.7)],
       0.38, 0.26)

# catering truck at the aft door: cab, chassis, scissor lift, raised box body
CX = -8.2
truck = parts("catering_chassis", [
    ((2.2, 6.6, 0.5), (0, -7.4, 0.65)),
    ((2.4, 0.3, 0.3), (0, -4.3, 0.45)),
], loc=(CX, 0, 0), cname=SC)
styled(truck, "steel_dk")
styled(parts("catering_cab", [((2.3, 1.8, 1.7), (0, -10.3, 1.55))], loc=(CX, 0, 0), cname=SC),
       "steel")
styled(parts("catering_roof", [((2.4, 1.9, 0.14), (0, -10.3, 2.45))], loc=(CX, 0, 0), cname=SC),
       "orange_lt")
wheels("catering_wheels", [(CX + sx * 1.05, y, 0.48) for sx in (-1, 1) for y in (-9.6, -5.6)],
       0.48, 0.3)
scissor = []
for sx in (-1, 1):
    for a in (1, -1):
        scissor.append(((0.12, 4.2, 0.14), (sx * 0.95, -6.2, 1.95), (a * 0.42, 0, 0)))
styled(parts("catering_lift", scissor, loc=(CX, 0, 0), cname=SC), "steel")
box = parts("catering_box", [
    ((2.4, 4.6, 2.3), (0, -6.0, 4.0)),
    ((1.4, 0.9, 0.12), (0, -3.25, 2.9)),      # the platform to the door
], loc=(CX, 0, 0), cname=SC)
styled(box, "white")
styled(parts("catering_stripe", [((2.46, 4.66, 0.3), (0, -6.0, 3.15))], loc=(CX, 0, 0), cname=SC),
       "orange_lt")

# GPU on its trailer by the nose, the cable up to the socket
gpu = parts("gpu_body", [((2.4, 1.3, 1.2), (0, 0, 1.1)), ((0.08, 0.08, 0.6), (1.2, 0, 0.4)),
                         ((0.9, 0.08, 0.08), (1.6, 0, 0.3))],
            loc=(10.6, -6.2, 0), cname=SC)
styled(gpu, "steel")
styled(parts("gpu_trim", [((2.44, 1.34, 0.16), (0, 0, 1.55))], loc=(10.6, -6.2, 0), cname=SC),
       "orange_lt")
wheels("gpu_wheels", [(10.6 + dx, -6.2 + dy, 0.3) for dx in (-0.8, 0.8) for dy in (-0.6, 0.6)],
       0.3, 0.2)
cable = parts("gpu_cable", [((0.08, 0.08, 3.8), (11.3, -4.4, 1.4), (-0.95, 0, 0))], cname=SC)
styled(cable, "steel_dk")

# pushback tug at the nose, towbar to the nose gear
tug = parts("pushback_body", [
    ((4.4, 2.7, 1.0), (0, 0, 0.85)),
    ((0.5, 2.7, 0.4), (-2.1, 0, 0.7)),
], loc=(18.6, FUSE_Y, 0), cname=SC)
styled(tug, "steel_dk")
styled(parts("pushback_cab", [((1.2, 1.1, 0.8), (0.9, -0.6, 1.75))], loc=(18.6, FUSE_Y, 0), cname=SC),
       "steel")
styled(parts("pushback_roof", [((1.3, 1.2, 0.12), (0.9, -0.6, 2.2))], loc=(18.6, FUSE_Y, 0), cname=SC),
       "orange_lt")
wheels("pushback_wheels", [(18.6 + dx, FUSE_Y + dy, 0.5) for dx in (-1.4, 1.4) for dy in (-1.2, 1.2)],
       0.5, 0.36)
bar = parts("pushback_towbar", [((4.0, 0.16, 0.16), (14.4, 0, 0.55))], loc=(0, FUSE_Y, 0), cname=SC)
styled(bar, "steel")


# --- the hangar ---------------------------------------------------------------------
def ribbed(name, along_x, span, at, centre):
    """A clad wall with the hall shell's ribs, standing on the far side."""
    boxes = []
    if along_x:
        boxes.append(((span, 0.30, H), (0, 0, H / 2)))
    else:
        boxes.append(((0.30, span, H), (0, 0, H / 2)))
    n = int(span / 1.6)
    for i in range(n + 1):
        u = -span / 2 + i * 1.6
        if along_x:
            boxes.append(((0.09, 0.10, H * 0.94), (u, -0.19, H / 2)))
        else:
            boxes.append(((0.10, 0.09, H * 0.94), (0.19, u, H / 2)))
    loc = (centre, at, 0) if along_x else (at, centre, 0)
    styled(parts(name, boxes, loc=loc, cname=SC), "paper")


HW = HANGAR_X1 - SIDE_X
HX = (HANGAR_X1 + SIDE_X) / 2
ribbed("hall_wall_y", True, HW, BACK_Y, HX)
ribbed("hall_wall_x", False, BACK_Y - HANGAR_Y, SIDE_X, (BACK_Y + HANGAR_Y) / 2)

# portal: the two door posts, the deep header truss over the opening, the
# columns along the back wall, and roof trusses back to it
portal = []
for x in (SIDE_X + 0.4, HANGAR_X1):
    portal.append(((0.7, 0.7, H), (x, HANGAR_Y, H / 2)))
    portal.append(((0.7, 0.7, H), (x, BACK_Y - 0.4, H / 2)))
portal.append(((HW + 0.7, 0.5, 0.35), (HX, HANGAR_Y, H - 0.2)))
portal.append(((HW + 0.7, 0.5, 0.35), (HX, HANGAR_Y, H - 2.0)))
n = int(HW / 2.0)
for i in range(n):
    x = SIDE_X + 0.4 + (i + 0.5) * HW / n
    portal.append(((0.12, 0.3, 2.5), (x, HANGAR_Y, H - 1.1), (0, (0.6 if i % 2 else -0.6), 0)))
for x in (SIDE_X + 8.4, SIDE_X + 16.4, SIDE_X + 24.4):
    portal.append(((0.45, 0.45, H), (x, BACK_Y - 0.45, H / 2)))
    portal.append(((0.3, BACK_Y - HANGAR_Y, 0.4), (x, (BACK_Y + HANGAR_Y) / 2, H - 0.2)))
styled(parts("hall_cols_y_portal", portal, cname=SC), "steel")

# the hangar doors, slid open and stacked against the side wall
doors = [((3.2, 0.25, H - 2.4), (SIDE_X + 2.0, HANGAR_Y + 0.5 + i * 0.35, (H - 2.4) / 2))
         for i in range(3)]
styled(parts("hall_cols_y_doors", doors, cname=SC), "steel_dk")

# inside: an engine on its transport stand, a work stand beside it
EX, EY = -13.0, 13.2
cradle = parts("hangar_cradle", [
    ((4.2, 2.4, 0.25), (0, 0, 0.35)),
    ((0.3, 1.8, 0.9), (-1.2, 0, 0.9)),
    ((0.3, 1.8, 0.9), (1.2, 0, 0.9)),
], loc=(EX, EY, 0), cname=SC)
styled(cradle, "orange_lt")
wheels("hangar_cradle_wheels", [(EX + dx, EY + dy, 0.2) for dx in (-1.8, 1.8) for dy in (-1.1, 1.1)],
       0.2, 0.18)
eng = loft("hangar_engine", [(2.2, 2.5, 1.05), (1.9, 2.5, 1.15), (-0.6, 2.5, 1.15),
                             (-1.6, 2.5, 0.85), (-2.2, 2.5, 0.45)], loc=(EX, EY, 0), segments=18)
styled(eng, "steel")
styled(disc("hangar_engine_fan", 0.95, loc=(EX + 2.23, EY, 2.5), rot=(0, math.pi / 2, 0),
            cname=SC, segments=18), "steel_dk")

SX, SY = -8.4, 13.2          # the work stand: platform, legs, stair, toe rails
stand = [((2.6, 2.4, 0.15), (0, 0, 2.6))]
for dx in (-1.2, 1.2):
    for dy in (-1.1, 1.1):
        stand.append(((0.12, 0.12, 2.6), (dx, dy, 1.3)))
        stand.append(((0.12, 0.12, 1.1), (dx, dy, 3.2)))
for k in range(6):
    stand.append(((0.9, 0.35, 0.08), (2.0 + k * 0.42, 0, 2.45 - k * 0.42)))
for sy in (-1, 1):
    stand.append(((3.5, 0.08, 0.3), (2.85, sy * 0.47, 1.3), (0, math.radians(45), 0)))
styled(parts("hangar_stand", stand, loc=(SX, SY, 0), cname=SC), "steel")
rails = [((2.6, 0.08, 0.08), (0, sy * 1.1, 3.7)) for sy in (-1, 1)]
rails += [((0.08, 2.4, 0.08), (sx * 1.2, 0, 3.7)) for sx in (-1, 1)]
styled(parts("hangar_stand_rails", rails, loc=(SX, SY, 0), cname=SC), "hivis")

# tool chests and the parts rack along the back wall
chests = parts("hangar_chests", [((1.2, 0.7, 1.1), (0, 0, 0.55)), ((1.2, 0.7, 1.1), (1.4, 0, 0.55)),
                                 ((1.0, 0.6, 0.4), (0.0, 0, 1.3))],
               loc=(-3.6, 11.4, 0), cname=SC)
styled(chests, "orange")
rack_module("hangar_parts", (-11.0, BACK_Y - 1.1, 0), bays=5, levels=3, depth=1.0, bay_w=2.6,
            cname=SC, detail=1)

# past the hangar's end: ULD containers on their dollies, waiting for the hold
ULD = [(-0.78, 0.0), (0.78, 0.0), (0.78, 1.62), (-0.25, 1.62), (-0.78, 1.0)]
for i, (x, y) in enumerate(((12.0, 11.4), (14.6, 11.4), (17.2, 11.4), (12.0, 14.8), (14.6, 14.8))):
    dolly = parts("uld_dolly_%d" % i, [((2.0, 1.9, 0.14), (0, 0, 0.5)), ((0.8, 0.08, 0.08), (0, -1.3, 0.35))],
                  loc=(x, y, 0), cname=SC)
    styled(dolly, "steel")
    wheels("uld_dolly_%d_wheels" % i, [(x + dx, y + dy, 0.22) for dx in (-0.7, 0.7) for dy in (-0.7, 0.7)],
           0.22, 0.16)
    can = prism("uld_%d_load" % i, ULD, 1.5, plane="yz", loc=(x, y, 0.57))
    styled(can, ("brown", "orange", "orange_lt")[i % 3])
