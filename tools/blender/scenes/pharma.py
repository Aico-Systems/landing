"""Pharma: a specialty pharma distribution warehouse, calmer and tidier than
the general one — the cold chain at a glance.

Builds the SCENE collection, which export.py writes:
  SCENE   the hall (floor and the two far walls, no roof); an insulated cold
          room in the far corner (panel walls, strip-curtain door, temperature
          panel, condensing units on its roof); two runs of light shelving with
          small boxed goods; a quarantine cage holding lots on pallets; a
          checking bench with totes; temperature-controlled shippers on pallets
          waiting at dispatch

Everything runs along x. The walkways the page's routes use (src/lib/verticals.ts,
z = -y) are free from end to end: y = 6.0 in front of the cold room, y = 0 between
the shelving runs, y = -6.0 for the pallet truck, y = -11.5 past the bench.
"""
exec(compile(open(f"{KIT}/props.py").read(), "props.py", "exec"))

SC = "SCENE"
GOODS = ("orange", "orange_lt", "brown")

hall_shell("hall", cname=SC, size=(46.0, 34.0), height=7.0, bay=8.0, roof=False,
           cladding="smooth", wall_fill="white", band="steel_dk")

# --- floor markings: the walkways, edged in hi-vis ----------------------------
lanes = []
for y, x0, x1 in ((7.3, -20.0, 20.0), (4.7, -20.0, 20.0), (2.0, -20.0, 20.0),
                  (-2.0, -20.0, 20.0), (-4.7, -20.0, 20.0), (-7.3, -20.0, 20.0)):
    lanes.append(((x1 - x0, 0.10, 0.03), ((x0 + x1) / 2, y, 0.02)))
styled(parts("floor_lanes", lanes, cname=SC), "hivis")


# --- the cold room ------------------------------------------------------------
def cold_room(name, x0, x1, y0, y1, h=3.6, door_x=0.0, door_w=2.2):
    """An insulated box room: white sandwich panels with their seams standing
    out, steel corner trim and kerb, a strip-curtain door in the front (-y)
    face, the temperature panel beside it and the condensing units on top."""
    W, D = x1 - x0, y1 - y0
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    dx = door_x - cx  # door centre, local
    t = 0.16
    left = (dx - door_w / 2) - (-W / 2)
    right = W / 2 - (dx + door_w / 2)
    head = 0.9
    panels = [
        ((W, t, h), (0, D / 2 - t / 2, h / 2)),                     # back
        ((t, D, h), (-W / 2 + t / 2, 0, h / 2)),                    # sides
        ((t, D, h), (W / 2 - t / 2, 0, h / 2)),
        ((left, t, h), (-W / 2 + left / 2, -D / 2 + t / 2, h / 2)),  # front, either side of the door
        ((right, t, h), (W / 2 - right / 2, -D / 2 + t / 2, h / 2)),
        ((door_w, t, head), (dx, -D / 2 + t / 2, h - head / 2)),    # over the door
        ((W, D, 0.18), (0, 0, h + 0.09)),                           # the lid
    ]
    styled(parts("%s_panels" % name, panels, loc=(cx, cy, 0), cname=SC), "white")

    # panel seams: thin ribs every 1.2 m on the two faces the camera sees
    seams = []
    n = int(W / 1.2)
    for i in range(1, n):
        u = -W / 2 + i * W / n
        if abs(u - dx) < door_w / 2 + 0.15:
            continue
        seams.append(((0.05, 0.03, h - 0.3), (u, -D / 2 - 0.015, h / 2 + 0.05)))
    m = int(D / 1.2)
    for i in range(1, m):
        u = -D / 2 + i * D / m
        seams.append(((0.03, 0.05, h - 0.3), (W / 2 + 0.015, u, h / 2 + 0.05)))
    styled(parts("%s_seams" % name, seams, loc=(cx, cy, 0), cname=SC), "paper")

    # steel: corner angles, the kerb along the floor, the edge round the lid,
    # and the door frame
    trim = []
    for sx in (-1, 1):
        for sy in (-1, 1):
            trim.append(((0.14, 0.14, h + 0.2), (sx * W / 2, sy * D / 2, (h + 0.2) / 2)))
    trim += [
        ((W + 0.1, 0.10, 0.22), (0, -D / 2 - 0.04, 0.11)),
        ((0.10, D + 0.1, 0.22), (W / 2 + 0.04, 0, 0.11)),
        ((W + 0.12, 0.12, 0.10), (0, -D / 2, h + 0.2)),
        ((0.12, D + 0.12, 0.10), (W / 2, 0, h + 0.2)),
        ((0.14, 0.18, h - head), (dx - door_w / 2 - 0.05, -D / 2 - 0.02, (h - head) / 2)),
        ((0.14, 0.18, h - head), (dx + door_w / 2 + 0.05, -D / 2 - 0.02, (h - head) / 2)),
        ((door_w + 0.24, 0.18, 0.14), (dx, -D / 2 - 0.02, h - head)),
    ]
    styled(parts("%s_trim" % name, trim, loc=(cx, cy, 0), cname=SC), "steel")

    # the doorway's dark, and the strip curtain hanging in front of it
    dark = cube("%s_doorway" % name, (door_w, 0.04, h - head), loc=(door_x, y0 + 0.05, (h - head) / 2),
                cname=SC)
    styled(dark, "steel_dk")
    strips, ns = [], 7
    sw = door_w / ns
    for i in range(ns):
        strips.append(((sw * 0.86, 0.03, h - head - 0.12),
                       (-door_w / 2 + (i + 0.5) * sw, 0, (h - head) / 2 + 0.06)))
    styled(parts("%s_curtain" % name, strips, loc=(door_x, y0 - 0.06, 0), cname=SC), "paper")

    # the temperature panel: a box on the wall beside the door, screen and lamp
    px = door_x + door_w / 2 + 0.8
    panel = parts("%s_tempanel" % name, [
        ((0.70, 0.10, 0.55), (0, 0, 0)),
        ((0.06, 0.06, 0.40), (0, 0.02, -0.45)),  # the conduit down to it
    ], loc=(px, y0 - 0.06, 1.65), cname=SC)
    styled(panel, "steel_dk")
    screen = cube("%s_tempanel_screen" % name, (0.48, 0.03, 0.26), loc=(px, y0 - 0.12, 1.70), cname=SC)
    styled(screen, "blue")
    lamp = cube("%s_tempanel_lamp" % name, (0.12, 0.03, 0.08), loc=(px, y0 - 0.12, 1.47), cname=SC)
    styled(lamp, "hivis")

    # condensing units on the lid: casing in steel, fans dark
    units, fans = [], []
    for i, ux in enumerate((-W / 4, W / 4)):
        units.append(((2.0, 1.1, 0.80), (ux, D / 4, h + 0.58)))
        units.append(((0.10, 0.10, 0.6), (ux - 0.8, D / 4 - 0.7, h + 0.4)))  # the pipe run
        for k in (-0.5, 0.5):
            fans.append(disc("%s_fan_%d_%d" % (name, i, k > 0), 0.34,
                             loc=(cx + ux + k, cy + D / 4, h + 0.99), cname=SC, segments=16))
    styled(parts("%s_units" % name, units, loc=(cx, cy, 0), cname=SC), "steel")
    for f in fans:
        styled(f, "steel_dk")


# the 2-8 degree room, long, and a smaller freezer room beside it
cold_room("coldroom", -21.0, -6.0, 8.0, 15.4, door_x=-13.0)
cold_room("freezer", -4.0, 5.0, 8.4, 15.4, h=3.0, door_x=-0.5, door_w=1.8)


# --- light shelving with small boxed goods ------------------------------------
def shelving(name, x, y, bays=8, bay_w=2.0, depth=0.8, levels=4, seed=0):
    """A run of light shelving: steel uprights and solid shelves, small cases
    on every shelf, sized and spaced unevenly but squared up — a tidy pick
    face, not pallet racking."""
    pitch = 0.48
    h = 0.16 + (levels - 1) * pitch + 0.35
    L = bays * bay_w
    frame = []
    for b in range(bays + 1):
        u = -L / 2 + b * bay_w
        for sy in (-1, 1):
            frame.append(((0.06, 0.06, h), (u, sy * (depth / 2 - 0.03), h / 2)))
        frame.append(((0.03, depth, 0.03), (u, 0, h - 0.05)))
    for lv in range(levels):
        frame.append(((L, depth, 0.03), (0, 0, 0.16 + lv * pitch)))
    styled(parts("%s_frame" % name, frame, loc=(x, y, 0), cname=SC), "steel")

    # One product per shelf in each bay: the same case repeated in a row,
    # faced up to the front. A pharma pick face is this orderly; mixed sizes
    # on one shelf is what made the first pass read as a general warehouse.
    sizes = ((0.24, 0.16), (0.30, 0.20), (0.36, 0.24), (0.42, 0.18))
    tones = ("orange_lt", "orange_lt", "orange", "orange_lt", "brown", "orange")
    for b in range(bays):
        groups = {c: [] for c in GOODS}
        for lv in range(levels):
            k = (b * 5 + lv * 3 + seed * 7) % 23
            w, hh = sizes[k % len(sizes)]
            c = tones[k % len(tones)]
            z = 0.16 + lv * pitch + 0.015
            n = int((bay_w - 0.16) / (w + 0.03))
            n -= (k % 4 == 1)          # a case or two already picked
            u0 = -L / 2 + b * bay_w + 0.10
            for i in range(n):
                groups[c].append(((w, depth * 0.80, hh), (u0 + i * (w + 0.03) + w / 2, 0, z + hh / 2)))
        for c, boxes in groups.items():
            if boxes:
                styled(parts("%s_load_%d_%s" % (name, b, c), boxes, loc=(x, y, 0), cname=SC), c)


# two back-to-back runs either side of the middle walkway
# two back-to-back runs either side of the middle walkway, broken at x = 1
# by a cross aisle
for i, y in enumerate((3.0, 3.8, -3.0, -3.8)):
    shelving("shelf_%d_w" % i, -10.0, y, bays=9, seed=i)
    shelving("shelf_%d_e" % i, 10.0, y, bays=7, seed=i + 4)


# --- the quarantine cage -------------------------------------------------------
def cage(name, x0, x1, y0, y1, h=2.4, gate=(0.0, 1.6)):
    """A mesh enclosure for held lots: posts, top and bottom rails, mesh in
    thin bars, a gate in the front (-y) side, a hi-vis border on the floor."""
    W, D = x1 - x0, y1 - y0
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    gx, gw = gate
    frame, mesh = [], []

    def side(a, b, along_x, at, skip=None):
        """One side, in world xy: posts every ~2 m, three rails, the mesh."""
        def pt(u):
            return (u, at) if along_x else (at, u)

        def run(lo, hi, z, t):
            c = pt((lo + hi) / 2)
            s = (hi - lo, t, t) if along_x else (t, hi - lo, t)
            return (s, (c[0], c[1], z))
        n = max(1, int(round((b - a) / 2.0)))
        for i in range(n + 1):
            p = pt(a + i * (b - a) / n)
            frame.append(((0.08, 0.08, h), (p[0], p[1], h / 2)))
        spans = ((a, skip[0]), (skip[1], b)) if skip else ((a, b),)
        for lo, hi in spans:
            for z in (0.12, h / 2, h - 0.04):
                frame.append(run(lo, hi, z, 0.05))
            for k in range(1, 9):
                mesh.append(run(lo, hi, 0.12 + k * (h - 0.16) / 9, 0.016))
        m = int((b - a) / 0.16)
        for i in range(1, m):
            u = a + i * (b - a) / m
            if skip and skip[0] - 0.05 < u < skip[1] + 0.05:
                continue
            p = pt(u)
            mesh.append(((0.018, 0.018, h - 0.2), (p[0], p[1], h / 2)))

    # front with a gate gap, the back and both ends
    side(x0, x1, True, y0, skip=(cx + gx - gw / 2, cx + gx + gw / 2))
    side(x0, x1, True, y1)
    side(y0, y1, False, x0)
    side(y0, y1, False, x1)
    frame = [(s, (o[0] - cx, o[1] - cy, o[2])) for s, o in frame]
    mesh = [(s, (o[0] - cx, o[1] - cy, o[2])) for s, o in mesh]
    styled(parts("%s_frame" % name, frame, loc=(cx, cy, 0), cname=SC), "steel_dk")
    styled(parts("%s_mesh" % name, mesh, loc=(cx, cy, 0), cname=SC), "steel")

    # the gate, shut: held lots stay locked until QA releases them
    gate_obj = parts("%s_gate" % name, [
        ((gw, 0.05, 0.05), (gw / 2, 0, 0.12)),
        ((gw, 0.05, 0.05), (gw / 2, 0, h - 0.1)),
        ((0.06, 0.06, h - 0.1), (gw, 0, h / 2)),
    ] + [((0.018, 0.018, h - 0.25), (gw * j / 8, 0, h / 2)) for j in range(1, 8)],
        loc=(cx + gx - gw / 2, y0 - 0.06, 0), cname=SC)
    styled(gate_obj, "steel_dk")

    # floor border: hi-vis band just inside the mesh
    b = 0.14
    border = parts("%s_border" % name, [
        ((W, b, 0.03), (0, -D / 2 - 0.25, 0.02)),
        ((W, b, 0.03), (0, D / 2 + 0.25, 0.02)),
        ((b, D + 0.64, 0.03), (-W / 2 - 0.25, 0, 0.02)),
        ((b, D + 0.64, 0.03), (W / 2 + 0.25, 0, 0.02)),
    ], loc=(cx, cy, 0), cname=SC)
    styled(border, "hivis")
    # the hold sign on the gate post: a plate in hi-vis, no text
    sign = cube("%s_sign" % name, (0.7, 0.04, 0.45), loc=(cx + gx + gw / 2 + 0.5, y0 - 0.05, 1.7), cname=SC)
    styled(sign, "hivis")


def pallet(name, x, y, w=1.2, d=1.0, rot=0.0, fill="steel"):
    """A plastic pallet: deck and three runners. Pharma doesn't ship on wood."""
    p = parts(name, [
        ((w, d, 0.04), (0, 0, 0.13)),
        ((w, 0.12, 0.11), (0, -d / 2 + 0.06, 0.055)),
        ((w, 0.12, 0.11), (0, 0, 0.055)),
        ((w, 0.12, 0.11), (0, d / 2 - 0.06, 0.055)),
    ], loc=(x, y, 0), rot=(0, 0, rot), cname=SC)
    styled(p, fill)
    return 0.15


def case_stack(name, x, y, w=1.2, d=1.0, layers=3, fill="brown", z0=0.15, cols=2, rows=2, rot=0.0):
    """Cases stacked squarely on a pallet, one welded object."""
    boxes = []
    cw, cd, ch = w / cols, d / rows, 0.32
    for l in range(layers):
        for i in range(cols):
            for j in range(rows):
                boxes.append(((cw - 0.03, cd - 0.03, ch - 0.02),
                              (-w / 2 + (i + 0.5) * cw, -d / 2 + (j + 0.5) * cd, z0 + l * ch + ch / 2),
                              (0, 0, 0), 0.01))
    styled(parts(name, boxes, loc=(x, y, 0), rot=(0, 0, rot), cname=SC), fill)


CAGE = (9.0, 17.0, 7.8, 15.0)
cage("quarantine", *CAGE, gate=(-1.0, 1.8))
for i, (px, py, layers, fill) in enumerate(((11.0, 13.6, 3, "brown"), (13.0, 13.6, 2, "orange"),
                                            (15.2, 13.6, 3, "brown"), (14.6, 10.6, 2, "orange_lt"),
                                            (16.0, 9.2, 1, "brown"))):
    z = pallet("quarantine_pallet_%d" % i, px, py)
    case_stack("quarantine_load_%d" % i, px, py, layers=layers, fill=fill, z0=z)


# --- the checking bench: totes in, checked, packed out -------------------------
def tote(name, x, y, z, fill="orange_lt", lid=False):
    """An open-topped tote: a floor and four walls, so it reads as a container."""
    w, d, h, t = 0.60, 0.40, 0.30, 0.03
    boxes = [((w, d, t), (0, 0, t / 2)),
             ((w, t, h), (0, -d / 2 + t / 2, h / 2)), ((w, t, h), (0, d / 2 - t / 2, h / 2)),
             ((t, d, h), (-w / 2 + t / 2, 0, h / 2)), ((t, d, h), (w / 2 - t / 2, 0, h / 2))]
    if lid:
        boxes.append(((w + 0.02, d + 0.02, 0.04), (0, 0, h + 0.02)))
    styled(parts(name, boxes, loc=(x, y, z), cname=SC), fill)


def bench(name, x, y, L=4.4, d=0.9):
    """A packing and checking bench: steel frame, pale top, an overhead shelf
    with a scanner screen, totes and a few cases on it, a roller of totes
    feeding it."""
    zt = 0.92
    frame = []
    for sx in (-1, 1):
        for sy in (-1, 1):
            frame.append(((0.06, 0.06, zt), (sx * (L / 2 - 0.1), sy * (d / 2 - 0.08), zt / 2)))
        frame.append(((0.05, 0.05, 1.0), (sx * (L / 2 - 0.1), d / 2 - 0.08, zt + 0.5)))
    frame.append(((L - 0.2, d - 0.16, 0.03), (0, 0, 0.2)))           # the under-shelf
    frame.append(((L - 0.1, 0.30, 0.03), (0, d / 2 - 0.15, zt + 0.80)))  # the over-shelf
    styled(parts("%s_frame" % name, frame, loc=(x, y, 0), cname=SC), "steel")
    top = cube("%s_top" % name, (L, d, 0.05), loc=(x, y, zt), cname=SC)
    styled(top, "white")
    scr = parts("%s_screen" % name, [((0.60, 0.05, 0.40), (0, 0, 0)), ((0.06, 0.06, 0.3), (0, 0.05, -0.30))],
                loc=(x - 0.6, y + 0.25, zt + 0.55), cname=SC)
    styled(scr, "steel_dk")
    face = cube("%s_screen_face" % name, (0.52, 0.02, 0.32), loc=(x - 0.6, y + 0.22, zt + 0.55), cname=SC)
    styled(face, "blue")
    tote("%s_load_tote_0" % name, x - 1.6, y - 0.05, zt + 0.025)
    tote("%s_load_tote_1" % name, x + 0.5, y - 0.05, zt + 0.025, fill="orange")
    styled(parts("%s_load_cases" % name, [((0.30, 0.22, 0.16), (0, 0, 0.08)),
                                          ((0.24, 0.20, 0.12), (0.32, 0.02, 0.06)),
                                          ((0.22, 0.18, 0.10), (0.05, 0.0, 0.21))],
                 loc=(x + 1.4, y - 0.05, zt + 0.025), cname=SC), "brown")
    # shipper being packed, white insulated box with the lid off beside it
    styled(cube("%s_load_shipper" % name, (0.50, 0.40, 0.42), loc=(x - 0.5, y - 0.1, zt + 0.235), cname=SC), "white")
    # totes waiting on the under-shelf
    for i in range(3):
        tote("%s_load_tote_low_%d" % (name, i), x - 1.3 + i * 1.3, y, 0.215, lid=True,
             fill=("orange_lt", "orange", "orange_lt")[i])


bench("bench_a", -12.0, -10.4)
bench("bench_b", -5.5, -10.4)

# a gravity roller lane feeding totes along the benches' back
roller = []
for i in range(40):
    roller.append(((0.06, 0.6, 0.06), ((i - 19.5) * 0.30, 0, 0.78)))
for sy in (-1, 1):
    roller.append(((12.2, 0.06, 0.14), (0, sy * 0.33, 0.76)))
for i in range(5):
    for sy in (-1, 1):
        roller.append(((0.06, 0.06, 0.76), (-5.9 + i * 2.95, sy * 0.33, 0.38)))
styled(parts("conveyor_roller", roller, loc=(-8.75, -9.25, 0), cname=SC), "steel")
for i, tx in enumerate((-13.8, -10.6, -7.1, -3.6)):
    tote("conveyor_load_tote_%d" % i, tx, -9.25, 0.81, fill=GOODS[i % 2], lid=True)


# --- dispatch: temperature-controlled shippers on pallets ----------------------
def shipper_stack(name, x, y, layers=2, rot=0.0):
    """Insulated shippers: white bodies with an orange lid band — the shape
    every cold-chain parcel has — stacked on a plastic pallet, wrapped corners
    in steel."""
    z = pallet("%s_pallet" % name, x, y, rot=rot)
    bodies, lids = [], []
    w, d, ch = 0.58, 0.48, 0.44
    for l in range(layers):
        for i in range(2):
            for j in range(2):
                ox, oy = -0.3 + i * 0.6, -0.25 + j * 0.5
                zz = z + l * ch
                bodies.append(((w, d, ch - 0.10), (ox, oy, zz + (ch - 0.10) / 2), (0, 0, 0), 0.015))
                lids.append(((w + 0.01, d + 0.01, 0.08), (ox, oy, zz + ch - 0.06), (0, 0, 0), 0.01))
    styled(parts("%s_load_shippers" % name, bodies, loc=(x, y, 0), rot=(0, 0, rot), cname=SC), "white")
    styled(parts("%s_load_lids" % name, lids, loc=(x, y, 0), rot=(0, 0, rot), cname=SC), "orange")


for i, (sx, sy, layers) in enumerate(((5.0, -9.8, 2), (6.6, -9.8, 3), (8.2, -9.8, 2),
                                      (11.5, -9.8, 3), (13.1, -9.8, 1), (5.0, -12.6, 3),
                                      (6.6, -12.6, 2), (11.5, -12.6, 2))):
    shipper_stack("dispatch_%d" % i, sx, sy, layers=layers)

# the dispatch bay's floor box
styled(parts("dispatch_marking", [
    ((11.4, 0.12, 0.03), (0, -2.6, 0.02)), ((11.4, 0.12, 0.03), (0, 2.6, 0.02)),
    ((0.12, 5.3, 0.03), (-5.65, 0, 0.02)), ((0.12, 5.3, 0.03), (5.65, 0, 0.02)),
], loc=(9.0, -11.2, 0), cname=SC), "hivis")
