"""Parcel & post: a sorting hub with its loading dock.

Builds the SCENE collection, which export.py writes:
  SCENE   the hall (floor and the two far walls, no roof); the sorter down the
          middle (an induction table and incline at the -x end, a scan tunnel,
          then a raised belt with slides branching off both sides into roll
          cages); hold shelving along the far wall; inbound cages in the far
          corner; an oversize / exceptions pen at the +x end; staged roll cages
          per route; and the dock along the near edge, where vans back up to
          the doors from a yard a dock's height below the floor

Everything runs along x. The free lanes the page's routes use (in metres,
z = -y): the far walkway at y = 11.3, the walkway between the sorter's cages
and the staging at y = 1.0, and the dock lane at y = -8.6.
"""
exec(compile(open(f"{KIT}/props.py").read(), "props.py", "exec"))

import random

SC = "SCENE"
W, D = 46.0, 32.0
Y0 = -D / 2                       # the dock edge, the hall's open near side
DOCK = 1.2                        # the dock's height above the yard

BELT_Y = 6.2                      # the sorter's main belt
BELT_Z = 1.9                      # its running surface
BELT_W = 1.1
CHUTE_X = [-8.0 + 2.0 * i for i in range(12)]   # a slide each side every 2 m
LANES = (11.3, 1.0, -8.6)         # far walkway, mid walkway, dock lane
DOORS = (-13.0, -5.0, 3.0, 11.0)  # dock doors, a bay apart
VANS = (-13.0, 3.0, 11.0)         # the closed door has no van

rng = random.Random(7)
PARCEL = ("brown", "orange", "orange_lt")

hall_shell("hall", cname=SC, size=(W, D), height=7.5, bay=8.0, roof=False, wall_fill="steel")


def parcels(name, boxes, tones=PARCEL):
    """Parcels as one object per colour: a few dozen boxes welded per tone,
    so a pile reads as mixed cartons without an object per carton."""
    by = {t: [] for t in tones}
    for i, b in enumerate(boxes):
        by[tones[i % len(tones)]].append(b)
    for t, bs in by.items():
        if bs:
            styled(parts("%s_%s" % (name, t), bs, cname=SC), t)


def pile(x, y, z, w, d, layers=2, fill=0.85):
    """Mixed-size parcels filling a w x d footprint from height z up."""
    out = []
    for lv in range(layers):
        cx = x - w / 2
        zz = z + lv * 0.34
        while cx < x + w / 2 - 0.18:
            pw = rng.choice((0.26, 0.34, 0.42, 0.50))
            pw = min(pw, x + w / 2 - cx)
            cy = y - d / 2
            while cy < y + d / 2 - 0.18:
                pd = min(rng.choice((0.24, 0.32, 0.40)), y + d / 2 - cy)
                if rng.random() < fill - lv * 0.25:
                    ph = rng.choice((0.16, 0.22, 0.30))
                    out.append(((pw - 0.04, pd - 0.04, ph),
                                (cx + pw / 2, cy + pd / 2, zz + ph / 2),
                                (0, 0, rng.uniform(-0.12, 0.12))))
                cy += pd
            cx += pw
    return out


# --- floor markings: lanes land with the floor --------------------------------
for i, y in enumerate(LANES):
    for sy in (-1, 1):
        x0, x1 = (-12.0, 18.0) if i == 0 else (-21.0, 21.0)
        m = cube("lane_%d_%d" % (i, sy > 0), (x1 - x0, 0.10, 0.03),
                 loc=((x0 + x1) / 2, y + sy * 1.3, 0.02), cname=SC)
        styled(m, "hivis")

# the yard below the dock, and the dock face between them
yard = cube("lane_yard", (W, 7.0, 0.22), loc=(0, Y0 - 3.5, -DOCK - 0.11), cname=SC)
styled(yard, "paper_dk")
face = cube("dock_face", (W, 0.24, DOCK), loc=(0, Y0 + 0.11, -DOCK / 2 + 0.005), cname=SC)
styled(face, "steel_dk")


# --- the sorter -----------------------------------------------------------------
def belt(name, x0, x1, z0, z1):
    """A belt from x0 to x1, rising from z0 to z1: dark band, steel side
    rails, legs every 2 m. One object per piece, so the wave passes along it."""
    L = x1 - x0
    ang = math.atan2(z1 - z0, L)
    mid = ((x0 + x1) / 2, BELT_Y, (z0 + z1) / 2)
    run = math.hypot(L, z1 - z0)
    band = cube("%s_band" % name, (run, BELT_W, 0.10), loc=(mid[0], mid[1], mid[2] - 0.05),
                rot=(0, -ang, 0), cname=SC)
    styled(band, "steel_dk")
    boxes = []
    for sy in (-1, 1):
        boxes.append(((run, 0.08, 0.26), (0, sy * (BELT_W / 2 + 0.04), 0.0), (0, -ang, 0)))
    n = max(1, int(L / 2.0))
    for i in range(n + 1):
        lx = -L / 2 + i * L / n
        h = z0 + (z1 - z0) * (lx + L / 2) / L - 0.12
        for sy in (-1, 1):
            boxes.append(((0.09, 0.09, h), (lx, sy * (BELT_W / 2 - 0.05), h / 2 - mid[2])))
        boxes.append(((0.08, BELT_W, 0.08), (lx, 0, h * 0.35 - mid[2])))
    frame = parts("%s_frame" % name, boxes, loc=mid, cname=SC)
    styled(frame, "steel")


# induction table at the -x end, an incline up to the sorter, then the belt
belt("sorter_induct", -21.0, -17.0, 0.9, 0.9)
belt("sorter_incline", -17.0, -12.5, 0.9, BELT_Z)
for k, (a, b) in enumerate(((-12.5, -6.0), (-6.0, 0.0), (0.0, 6.0), (6.0, 12.0), (12.0, 17.0))):
    belt("sorter_belt_%d" % k, a, b, BELT_Z, BELT_Z)

# the scan tunnel over the belt: a hooded arch with a screen on its side
tunnel = parts("sorter_scan", [
    ((1.6, 0.14, 1.5), (0, -0.85, BELT_Z + 0.6)),
    ((1.6, 0.14, 1.5), (0, 0.85, BELT_Z + 0.6)),
    ((1.8, 1.9, 0.30), (0, 0, BELT_Z + 1.45)),
], loc=(-10.5, BELT_Y, 0), cname=SC)
styled(tunnel, "steel")
screen = cube("sorter_scan_screen", (0.7, 0.05, 0.45), loc=(-10.5, BELT_Y - 0.94, BELT_Z + 0.9), cname=SC)
styled(screen, "blue")

# parcels riding the belt, gaps between them like a real induction
for k, (a, b) in enumerate(((-20.6, -17.2), (-12.0, -6.2), (-5.8, 0.0), (0.2, 6.0), (6.2, 12.0), (12.2, 16.6))):
    boxes = []
    x = a
    while x < b - 0.3:
        pw = rng.choice((0.30, 0.40, 0.55))
        ph = rng.choice((0.18, 0.26, 0.34))
        z = 0.9 if k == 0 else BELT_Z
        boxes.append(((pw, rng.choice((0.35, 0.45, 0.6)), ph),
                      (x + pw / 2, BELT_Y + rng.uniform(-0.2, 0.2), z + ph / 2),
                      (0, 0, rng.uniform(-0.3, 0.3))))
        x += pw + rng.choice((0.5, 0.9, 1.4))
    parcels("sorter_load_%d" % k, boxes)


def chute(name, x, sy):
    """A slide off the belt, down into the roll cage under its end."""
    ya, za = BELT_Y + sy * (BELT_W / 2 + 0.05), BELT_Z - 0.05
    yb, zb = BELT_Y + sy * 2.45, 1.30
    dy, dz = yb - ya, zb - za
    L = math.hypot(dy, dz)
    th = math.atan2(dz, dy)
    up = (0, -math.sin(th), math.cos(th))
    w = 0.80
    boxes = [((w, L, 0.05), (0, 0, 0), (th, 0, 0))]
    for sx in (-1, 1):
        boxes.append(((0.05, L, 0.22), (sx * w / 2, up[1] * 0.09, up[2] * 0.09), (th, 0, 0)))
    o = parts(name, boxes, loc=(x, (ya + yb) / 2, (za + zb) / 2), cname=SC)
    styled(o, "steel")


def roll_cage(x, y, open_side):
    """A roll cage's boxes, relative to the floor: base, casters, corner posts,
    mesh on three sides (the open side faces `open_side`, +1 or -1 in y)."""
    w, d, h = 0.80, 0.72, 1.60
    b = [((w, d, 0.08), (x, y, 0.16))]
    for sx in (-1, 1):
        b.append(((0.10, d - 0.06, 0.12), (x + sx * (w / 2 - 0.08), y, 0.06)))   # the casters
        for sy in (-1, 1):
            b.append(((0.04, 0.04, h - 0.2), (x + sx * w / 2, y + sy * d / 2, 0.2 + (h - 0.2) / 2)))
    back = y - open_side * d / 2
    for k in range(3):
        z = 0.55 + k * 0.45
        b.append(((w, 0.025, 0.025), (x, back, z)))
        for sx in (-1, 1):
            b.append(((0.025, d, 0.025), (x + sx * w / 2, y, z)))
    for k in range(1, 4):
        b.append(((0.02, 0.02, h - 0.2), (x - w / 2 + k * w / 4, back, 0.2 + (h - 0.2) / 2)))
    return b


def cages(name, spots, full=0.8):
    """A group of roll cages welded into one object, their parcels into another."""
    frame, load = [], []
    for (x, y, side) in spots:
        frame += roll_cage(x, y, side)
        if rng.random() < full:
            load += pile(x, y, 0.20, 0.72, 0.62, layers=rng.choice((1, 2, 3)))
    styled(parts("%s_cages" % name, frame, cname=SC), "steel")
    parcels("%s_load" % name, load)


for i, x in enumerate(CHUTE_X):
    for sy in (-1, 1):
        chute("sorter_chute_%d_%d" % (i, sy > 0), x, sy)
# the cages under the slides, grouped by four so the wave reaches them in turn
for g in range(3):
    xs = CHUTE_X[g * 4:(g + 1) * 4]
    for sy in (-1, 1):
        cages("sort_%d_%d" % (g, sy > 0),
              [(x, BELT_Y + sy * 2.85, -sy) for x in xs])

# --- the far wall: hold shelving, and inbound cages waiting to induct --------------
def hold_shelf(i, x, w=4.0, d=0.9, levels=4):
    """One section of the hold shelving: parcels waiting for a re-delivery or
    a collection, shelved loose rather than palletised."""
    y = 14.9
    frame = []
    for sx in (-1, 1):
        for sy in (-1, 1):
            frame.append(((0.08, 0.08, 2.6), (x + sx * w / 2, y + sy * d / 2, 1.3)))
        frame.append(((0.04, d, 0.04), (x + sx * w / 2, y, 1.3), (0.6, 0, 0)))
    load = []
    for lv in range(levels):
        z = 0.15 + lv * 0.62
        frame.append(((w, d, 0.04), (x, y, z)))
        load += pile(x, y, z + 0.02, w - 0.1, d - 0.1, layers=1, fill=0.75)
    styled(parts("hold_%d_shelf" % i, frame, cname=SC), "steel_dk")
    parcels("hold_%d_load" % i, load)


for i in range(7):
    hold_shelf(i, -10.0 + i * 4.0)
cages("inbound_0", [(-21.6 + 1.0 * i, 14.9, -1) for i in range(5)], full=1.0)
cages("inbound_1", [(-21.6 + 1.0 * i, 13.6, -1) for i in range(4)], full=0.9)
# bulk bags of parcels by the induction table
for k, (x, y) in enumerate(((-21.4, 9.0), (-20.0, 9.0))):
    bag = parts("inbound_bin_%d" % k, [((1.1, 1.1, 0.12), (0, 0, 0.06)),
                                        ((1.1, 0.06, 0.9), (0, -0.52, 0.55)),
                                        ((1.1, 0.06, 0.9), (0, 0.52, 0.55)),
                                        ((0.06, 1.1, 0.9), (-0.52, 0, 0.55)),
                                        ((0.06, 1.1, 0.9), (0.52, 0, 0.55))],
                loc=(x, y, 0), cname=SC)
    styled(bag, "steel_dk")
    parcels("inbound_bin_%d_load" % k, pile(x, y, 0.12, 1.0, 1.0, layers=3, fill=1.0))

# --- the exceptions pen at the +x end: oversize, damaged, no-read -----------------
EX = (20.4, 7.4)                       # its middle
pen = []
for (sx0, sy0, sx1, sy1) in ((18.2, 2.6, 22.6, 2.6), (18.2, 12.2, 22.6, 12.2),
                             (18.2, 2.6, 18.2, 6.0), (18.2, 8.8, 18.2, 12.2)):
    L = math.hypot(sx1 - sx0, sy1 - sy0)
    along_x = abs(sy1 - sy0) < 1e-6
    pen.append(((L if along_x else 0.10, 0.10 if along_x else L, 0.03),
                ((sx0 + sx1) / 2, (sy0 + sy1) / 2, 0.02)))
styled(parts("lane_exceptions", pen, cname=SC), "hivis")
# the reject slide off the belt's end into the pen
chute_end = parts("exceptions_slide", [((2.2, 0.8, 0.05), (0, 0, 0), (0, 0.42, 0)),
                                       ((2.2, 0.05, 0.22), (0, -0.4, 0.09), (0, 0.42, 0)),
                                       ((2.2, 0.05, 0.22), (0, 0.4, 0.09), (0, 0.42, 0))],
                  loc=(18.0, BELT_Y, BELT_Z - 0.45), cname=SC)
styled(chute_end, "steel")
cages("exceptions", [(19.6, BELT_Y, -1), (21.8, 10.9, -1), (21.8, 9.9, -1)])
# a bench with its screen, where a no-read gets its label by hand
bench = parts("exceptions_bench", [((2.0, 0.8, 0.06), (0, 0, 0.92)),
                                   ((0.06, 0.7, 0.9), (-0.95, 0, 0.45)),
                                   ((0.06, 0.7, 0.9), (0.95, 0, 0.45)),
                                   ((1.9, 0.6, 0.04), (0, 0, 0.25)),
                                   ((0.08, 0.08, 0.45), (0.5, 0.25, 1.15))],
              loc=(20.6, 3.7, 0), cname=SC)
styled(bench, "steel")
mon = cube("exceptions_screen", (0.6, 0.05, 0.4), loc=(21.1, 3.95, 1.45), cname=SC)
styled(mon, "blue")
parcels("exceptions_bench_load", [((0.5, 0.4, 0.3), (20.0, 3.7, 1.10), (0, 0, 0.2)),
                                  ((0.36, 0.3, 0.2), (19.9, 3.6, 1.35), (0, 0, -0.3))])
# oversize: a long tube, a flat crate, a bike box, a stack on a pallet
tube = capsule("exceptions_load_tube", 0.16, 2.4, loc=(20.3, 7.0, 0.17),
               rot=(0, math.pi / 2, 0.2), cname=SC)
styled(tube, "orange_lt")
pallet = parts("exceptions_pallet", [((1.2, 1.0, 0.14), (0, 0, 0.07))], loc=(21.2, 5.6, 0), cname=SC)
styled(pallet, "paper")
parcels("exceptions_load", [
    ((1.1, 0.9, 0.5), (21.2, 5.6, 0.39)),
    ((0.8, 0.7, 0.45), (21.15, 5.55, 0.87), (0, 0, 0.15)),
    ((1.9, 0.25, 1.1), (19.8, 9.0, 0.55)),
    ((1.6, 1.2, 0.30), (20.6, 11.0, 0.15)),
    ((0.9, 0.9, 0.9), (19.3, 11.1, 0.45), (0, 0, 0.3)),
], tones=("brown", "orange", "orange_lt"))


# --- staging: the sorted cages lined up per route, a block per dock door ------------
for i, dx in enumerate(DOORS + (18.6,)):
    for r, y in enumerate((-2.4, -3.4, -5.0, -6.0)):
        if i == 4 and r > 1:
            continue
        cages("stage_%d_%d" % (i, r), [(dx - 2.4 + 0.96 * k, y, -1 if r % 2 == 0 else 1)
                                       for k in range(6 if i < 4 else 4)], full=0.9)
# the gap block left of the first door: empty cages waiting to go back
cages("stage_empty", [(-20.6 + 0.96 * k, -2.4, -1) for k in range(4)], full=0.0)


# --- the dock: doors on the edge, levelers, and vans backed up to them --------------
def dock_door(i, x, open_):
    door = parts("dock_%d_door" % i, [
        ((0.30, 0.30, 3.4), (-1.75, 0, 1.7)),
        ((0.30, 0.30, 3.4), (1.75, 0, 1.7)),
        ((3.8, 0.34, 0.40), (0, 0, 3.5)),
    ], loc=(x, Y0 + 0.30, 0), cname=SC)
    styled(door, "steel")
    if open_:
        drum = capsule("dock_%d_drum" % i, 0.22, 3.3, loc=(x, Y0 + 0.30, 3.05),
                       rot=(0, math.pi / 2, 0), cname=SC, segments=10)
        styled(drum, "steel_dk")
    else:
        shut = parts("dock_%d_shutter" % i, [((3.2, 0.06, 0.30), (0, 0, 0.17 + 0.32 * k))
                                             for k in range(10)],
                     loc=(x, Y0 + 0.30, 0), cname=SC)
        styled(shut, "paper")
    lev = parts("dock_%d_leveler" % i, [((2.4, 2.6, 0.06), (0, 0, 0.03))], loc=(x, Y0 + 1.6, 0), cname=SC)
    styled(lev, "steel")
    edge = parts("lane_dock_%d" % i, [((0.10, 2.6, 0.03), (-1.3, 0, 0.02)),
                                      ((0.10, 2.6, 0.03), (1.3, 0, 0.02))],
                 loc=(x, Y0 + 1.6, 0), cname=SC)
    styled(edge, "hivis")
    bump = parts("dock_%d_bumpers" % i, [((0.30, 0.20, 0.45), (-1.2, 0, -0.45)),
                                         ((0.30, 0.20, 0.45), (1.2, 0, -0.45))],
                 loc=(x, Y0 - 0.08, 0), cname=SC)
    styled(bump, "steel_dk")


def wheel_set(name, centres, radius=0.36, width=0.26):
    """Wheels as short cylinders across x, welded into one object."""
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    for c in centres:
        v = bmesh.ops.create_cone(bm, cap_ends=True, segments=14, radius1=radius,
                                  radius2=radius, depth=width)["verts"]
        bmesh.ops.rotate(bm, verts=v, cent=(0, 0, 0), matrix=Euler((0, math.pi / 2, 0)).to_matrix())
        bmesh.ops.translate(bm, verts=v, vec=Vector(c))
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    link(obj, SC)
    styled(obj, "ink")


def van(i, x):
    """A delivery van backed onto the dock, nose to the yard (-y)."""
    g = -DOCK                         # the yard
    r = Y0 - 0.25                     # its tail, against the bumpers
    body = parts("van_%d_body" % i, [
        ((2.1, 3.9, 2.05), (0, -1.95, 0.55 + 1.02)),           # the box
        ((2.0, 1.2, 1.55), (0, -4.5, 0.55 + 0.78)),            # the cab
        ((2.0, 0.9, 0.80), (0, -5.5, 0.55 + 0.40)),            # the bonnet
    ], loc=(x, r, g), cname=SC)
    styled(body, "white")
    trim = parts("van_%d_trim" % i, [
        ((1.80, 0.06, 0.62), (0, -5.11, 0.55 + 1.20)),            # the windscreen
        ((2.04, 0.70, 0.50), (0, -4.6, 0.55 + 1.20)),             # side glass
        ((2.14, 0.20, 0.25), (0, -5.95, 0.55 + 0.10)),          # front bumper
        ((2.14, 0.15, 0.25), (0, 0.02, 0.55 + 0.05)),           # rear step
        ((2.12, 3.6, 0.40), (0, -2.9, 0.45)),                   # sills and arches
        ((1.8, 0.04, 1.75), (0, 0.01, 0.55 + 1.05)),            # the open back
    ], loc=(x, r, g), cname=SC)
    styled(trim, "steel_dk")
    stripe = cube("van_%d_stripe" % i, (2.13, 3.9, 0.18), loc=(x, r - 1.95, g + 1.35), cname=SC)
    styled(stripe, "orange")
    wheels = []
    for wy in (-1.0, -4.9):
        for sx in (-1, 1):
            wheels.append((x + sx * 0.92, r + wy, g + 0.36))
    wheel_set("van_%d_wheels" % i, wheels)


for i, x in enumerate(DOORS):
    dock_door(i, x, x in VANS)
for i, x in enumerate(VANS):
    van(i, x)
    # the cages on the leveler going in, and the next ones waiting beside it
    cages("dock_%d" % i, [(x - 0.5, Y0 + 1.3, 1), (x + 0.5, Y0 + 2.2, 1),
                          (x + 2.2, Y0 + 1.2, 1), (x + 2.2, Y0 + 2.2, 1)], full=1.0)
# by the shut door: a pallet of oversize waiting for the freight run
pal = parts("dock_pallet", [((1.2, 1.0, 0.14), (0, 0, 0.07))], loc=(-5.0, Y0 + 2.6, 0), cname=SC)
styled(pal, "paper")
parcels("dock_pallet_load", pile(-5.0, Y0 + 2.6, 0.14, 1.15, 0.95, layers=3, fill=1.0))
