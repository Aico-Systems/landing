"""Fashion: the returns floor of an omni-channel fashion distribution centre.

Builds the SCENE collection, which export.py writes:
  SCENE   the hall (floor and the two far walls, no roof); at the back, three
          rows of hanging-garment rails; in the middle, the grading tables,
          each with its worker spot and three bins (resell, repair,
          recycle); at the front, returns intake (parcels on pallets, open
          parcels on a feed conveyor, roll cages); along the far x wall,
          flat-pack shelving with folded stock

Everything runs along x. Walkways (Blender y): 4.4 between the rails and the
grading tables, 9.6 between the rail rows, -4.6 between grading and intake
(the tugger's lane). The page's routes (src/lib/verticals.ts) are in the same
metres, with z = -y.
"""
import random

exec(compile(open(f"{KIT}/props.py").read(), "props.py", "exec"))

SC = "SCENE"
WARM = ("orange", "orange_lt", "brown", "white")
rng = random.Random(11)

hall_shell("hall", cname=SC, size=(46.0, 34.0), height=8.0, bay=8.0, roof=False,
           cladding="smooth", band="brown")

# --- walkway markings: a pair of hivis lines either side of each lane ---------
LANES = ((4.4, 1.6, -17.0, 20.0), (9.6, 1.4, -17.0, 20.0), (-4.6, 1.8, -16.0, 20.0))
marks = []
for y, half, xa, xb in LANES:
    for sy in (-1, 1):
        marks.append(((xb - xa, 0.10, 0.03), ((xa + xb) / 2, y + sy * half, 0.02)))
styled(parts("lanes", marks, cname=SC), "hivis")


# --- hanging-garment rails ------------------------------------------------------
def garments(name, x0, x1, y, ztop, fill_gaps=0.12):
    """Garments hung on one bar along x: thin slabs facing along the rail,
    a narrower shoulder over each body, shirts short and coats long, in the
    warm shades. Welded into one object per colour, so a rail is four objects
    however many garments it carries."""
    by_role = {r: [] for r in WARM}
    x = x0
    while x < x1:
        if rng.random() < fill_gaps:          # an empty stretch: stock moved on
            x += rng.uniform(0.4, 1.2)
            continue
        role = rng.choices(WARM, weights=(4, 3, 3, 2))[0]
        length = rng.choice((0.72, 0.80, 0.95, 1.15, 1.30))
        w = rng.uniform(0.46, 0.56)
        tilt = (0, 0, math.radians(rng.uniform(-9, 9)))
        top = ztop - 0.06
        by_role[role].append(((0.05, w * 0.72, 0.10), (x, y, top - 0.05), tilt))
        by_role[role].append(((0.06, w, length), (x, y, top - 0.10 - length / 2), tilt))
        x += rng.uniform(0.11, 0.17)
    for role, boxes in by_role.items():
        if boxes:
            styled(parts("%s_load_%s" % (name, role), boxes, cname=SC), role)


def rail_row(name, y, x0, x1, tiers=1, post=3.2):
    """A double-sided run: two bars 0.9 apart on a post every `post` metres,
    garments under both; `tiers=2` stacks a second level above, the way a
    hanging-garment system climbs in a distribution centre."""
    pitch = 2.15
    frame = []
    n = int(round((x1 - x0) / post))
    for i in range(n + 1):
        x = x0 + i * (x1 - x0) / n
        frame.append(((0.09, 0.09, tiers * pitch + 0.1), (x, y, (tiers * pitch + 0.1) / 2)))
        frame.append(((0.09, 1.10, 0.07), (x, y, 0.06)))                     # foot
        for t in range(tiers):
            frame.append(((0.07, 1.05, 0.07), (x, y, (t + 1) * pitch)))     # cross arm
    for t in range(tiers):
        z = (t + 1) * pitch
        for dy in (-0.45, 0.45):
            frame.append(((x1 - x0, 0.05, 0.05), ((x0 + x1) / 2, y + dy, z)))
            garments("%s_t%d_%d" % (name, t, dy > 0), x0 + 0.2, x1 - 0.2, y + dy, z)
    styled(parts("%s_frame" % name, frame, cname=SC), "steel")


rail_row("rail_a", 7.0, -17.0, 20.0)
rail_row("rail_b", 12.2, -17.0, 20.0)
rail_row("rail_c", 15.0, -17.0, 20.0, tiers=2)


# --- grading tables: the middle of the floor ------------------------------------
def open_parcel(name, loc, size=(0.55, 0.40, 0.26), fill="orange_lt", inside="white", rot=0.0):
    """A carton with its top open: four walls, two flaps folded out, and the
    returned garment showing inside."""
    w, d, h = size
    t = 0.025
    box = [((w, d, 0.02), (0, 0, 0.01)),
           ((w, t, h), (0, -d / 2, h / 2)), ((w, t, h), (0, d / 2, h / 2)),
           ((t, d, h), (-w / 2, 0, h / 2)), ((t, d, h), (w / 2, 0, h / 2)),
           ((w, t, d * 0.45), (0, -d / 2 - d * 0.20, h + 0.02), (math.radians(-60), 0, 0)),
           ((w, t, d * 0.45), (0, d / 2 + d * 0.20, h + 0.02), (math.radians(60), 0, 0))]
    styled(parts(name + "_load_box", box, loc=loc, rot=(0, 0, rot), cname=SC), fill)
    styled(cube(name + "_load_item", (w * 0.8, d * 0.75, h * 0.6),
                loc=(loc[0], loc[1], loc[2] + h * 0.45), rot=(0, 0, rot), cname=SC), inside)


def bin_(name, loc, rim):
    """An open-top tote on a low dolly: dark walls, a coloured rim that tells
    the grader which stream it is, and what has gone in so far."""
    w, d, h = 0.80, 0.64, 0.66
    t = 0.04
    body = [((w, d, 0.04), (0, 0, 0.14)),
            ((w, t, h), (0, -d / 2, 0.12 + h / 2)), ((w, t, h), (0, d / 2, 0.12 + h / 2)),
            ((t, d, h), (-w / 2, 0, 0.12 + h / 2)), ((t, d, h), (w / 2, 0, 0.12 + h / 2)),
            ((w + 0.06, d + 0.06, 0.10), (0, 0, 0.04))]          # the dolly
    styled(parts(name + "_bin", body, loc=loc, cname=SC), "steel_dk")
    z, r = 0.12 + h, 0.07
    styled(parts(name + "_rim", [((w + 0.04, r, 0.05), (0, -d / 2, z)), ((w + 0.04, r, 0.05), (0, d / 2, z)),
                                 ((r, d + 0.04, 0.05), (-w / 2, 0, z)), ((r, d + 0.04, 0.05), (w / 2, 0, z))],
                 loc=loc, cname=SC), rim)
    heap, base = [], rng.uniform(0.38, 0.55)
    for k in range(rng.randint(2, 4)):                 # a few garments dropped in
        heap.append(((w * rng.uniform(0.45, 0.7), d * rng.uniform(0.45, 0.7), 0.06),
                     (rng.uniform(-0.12, 0.12), rng.uniform(-0.08, 0.08), base + k * 0.06),
                     (rng.uniform(-0.2, 0.2), rng.uniform(-0.2, 0.2), rng.uniform(-0.6, 0.6))))
    styled(parts(name + "_load_heap", heap, loc=loc, cname=SC),
           rng.choice(("orange", "orange_lt", "white", "brown")))


def grading_table(i, x, y=0.6):
    """A packing-height bench, a lamp arm and a screen over it, a returned
    parcel on one end and the garment being graded laid flat on the other.
    The worker spot is the hivis mat on its walkway side (-y); the three bins
    stand along it: resell, repair, recycle."""
    name = "grade_%d" % i
    L, D, H = 2.6, 1.1, 0.92
    frame = [((L, D, 0.06), (0, 0, H)),
             ((0.07, 0.07, H), (-L / 2 + 0.1, -D / 2 + 0.1, H / 2)),
             ((0.07, 0.07, H), (L / 2 - 0.1, -D / 2 + 0.1, H / 2)),
             ((0.07, 0.07, H), (-L / 2 + 0.1, D / 2 - 0.1, H / 2)),
             ((0.07, 0.07, H), (L / 2 - 0.1, D / 2 - 0.1, H / 2)),
             ((L - 0.2, D - 0.2, 0.04), (0, 0, 0.22)),                 # shelf under
             ((0.06, 0.06, 1.0), (L / 2 - 0.3, D / 2 - 0.1, H + 0.5)),  # lamp post
             ((0.06, 0.70, 0.06), (L / 2 - 0.3, D / 2 - 0.45, H + 1.0)),
             ((0.30, 0.22, 0.10), (L / 2 - 0.3, -0.05, H + 0.94))]      # lamp head
    styled(parts(name + "_table", frame, loc=(x, y, 0), cname=SC), "steel")
    styled(cube(name + "_screen", (0.50, 0.05, 0.34), loc=(x - 0.6, y + 0.42, H + 0.32),
                rot=(math.radians(-12), 0, 0), cname=SC), "blue")
    styled(cube(name + "_stand", (0.06, 0.06, 0.18), loc=(x - 0.6, y + 0.45, H + 0.09),
                cname=SC), "steel_dk")
    open_parcel(name + "_in", (x + 0.75, y + 0.05, H + 0.03), rot=math.radians(rng.uniform(-10, 10)))
    garment = rng.choice(("orange", "orange_lt", "brown"))
    styled(parts(name + "_load_garment", [((0.95, 0.55, 0.03), (0, 0, 0)),     # body, laid flat
                                         ((0.30, 0.85, 0.03), (0.30, 0, 0)),   # sleeves out
                                         ], loc=(x - 0.25, y - 0.1, H + 0.045),
                 rot=(0, 0, math.radians(rng.uniform(-6, 6))), cname=SC), garment)
    styled(cube(name + "_mat", (1.2, 0.8, 0.02), loc=(x, y - D / 2 - 0.55, 0.01), cname=SC), "hivis")
    for k, rim in enumerate(("orange", "hivis", "white")):        # resell, repair, recycle
        bin_("%s_%d" % (name, k), (x + L / 2 + 0.65, y + 0.80 - k * 0.80, 0), rim)


for i, x in enumerate((-15.0, -9.0, -3.0, 3.0, 9.0, 15.0)):
    grading_table(i, x)


# --- returns intake: the front of the floor --------------------------------------
def pallet(name, loc):
    deck = [((1.2, 1.0, 0.03), (0, 0, 0.135))]
    for dy in (-0.42, 0, 0.42):
        deck.append(((1.2, 0.14, 0.10), (0, dy, 0.07)))
    deck.append(((1.2, 1.0, 0.02), (0, 0, 0.01)))
    styled(parts(name + "_pallet", deck, loc=loc, cname=SC), "brown")


def parcel_stack(name, loc, layers):
    """Returned parcels on a pallet: mailer cartons of three sizes, loosely
    stacked, the top layer not full."""
    boxes = {"orange_lt": [], "orange": []}
    for lv in range(layers):
        z = 0.15
        z += lv * 0.30
        for cx in (-0.32, 0.30):
            for cy in (-0.26, 0.25):
                if lv == layers - 1 and rng.random() < 0.4:
                    continue
                s = (rng.uniform(0.48, 0.58), rng.uniform(0.40, 0.48), rng.uniform(0.22, 0.29))
                boxes[rng.choice(("orange_lt", "orange_lt", "orange"))].append(
                    (s, (cx, cy, z + s[2] / 2), (0, 0, math.radians(rng.uniform(-6, 6)))))
    for role, b in boxes.items():
        if b:
            styled(parts("%s_load_%s" % (name, role), b, loc=loc, cname=SC), role)


def roll_cage(name, loc, fill_h):
    """A roll cage of bagged returns: mesh sides drawn as bars, a stack of
    polybags inside."""
    w, d, h = 1.0, 0.8, 1.7
    bars = [((w, d, 0.05), (0, 0, 0.16))]
    for sx in (-1, 1):
        for sy in (-1, 1):
            bars.append(((0.04, 0.04, h), (sx * w / 2, sy * d / 2, 0.16 + h / 2)))
            bars.append(((0.10, 0.10, 0.10), (sx * (w / 2 - 0.08), sy * (d / 2 - 0.08), 0.06)))
    for k in range(1, 6):
        z = 0.16 + k * h / 5
        bars += [((w, 0.03, 0.03), (0, -d / 2, z)), ((w, 0.03, 0.03), (0, d / 2, z)),
                 ((0.03, d, 0.03), (-w / 2, 0, z))]
    styled(parts(name + "_cage", bars, loc=loc, cname=SC), "steel")
    bags = []
    z = 0.2
    while z < 0.2 + fill_h:
        t = rng.uniform(0.14, 0.22)
        bags.append(((w - 0.12, d - 0.12, t), (rng.uniform(-0.03, 0.03), rng.uniform(-0.03, 0.03), z + t / 2),
                     (0, 0, math.radians(rng.uniform(-5, 5))), 0.03))
        z += t + 0.01
    styled(parts(name + "_load_bags", bags, loc=loc, cname=SC), "white")


# the feed conveyor: parcels opened at the dock, garment showing, rolling toward grading
CONV_Y = -8.2
conv = [((15.0, 0.9, 0.10), (0, 0, 0.78))]
for k in range(8):
    x = -7.0 + k * 2.0
    conv += [((0.07, 0.07, 0.75), (x, -0.38, 0.37)), ((0.07, 0.07, 0.75), (x, 0.38, 0.37)),
             ((0.07, 0.86, 0.06), (x, 0, 0.25))]
conv += [((15.0, 0.06, 0.12), (0, -0.48, 0.84)), ((15.0, 0.06, 0.12), (0, 0.48, 0.84))]
styled(parts("intake_conveyor", conv, loc=(10.5, CONV_Y, 0), cname=SC), "steel_dk")
for k, x in enumerate((4.6, 6.8, 9.3, 11.4, 14.2, 16.3)):
    open_parcel("intake_open_%d" % k, (x, CONV_Y, 0.84),
                fill=rng.choice(("orange_lt", "orange_lt", "orange")),
                inside=rng.choice(WARM), rot=math.radians(rng.uniform(-12, 12)))

# pallets of parcels behind it, and the cages of bagged returns
for k, (x, y, layers) in enumerate(((5.0, -11.2, 3), (6.6, -11.2, 2), (8.2, -11.2, 3),
                                    (11.0, -11.2, 1), (12.6, -11.2, 3), (16.0, -11.2, 2),
                                    (5.8, -13.0, 2), (9.0, -13.0, 3), (15.2, -13.0, 3))):
    pallet("intake_%d" % k, (x, y, 0))
    parcel_stack("intake_%d" % k, (x, y, 0), layers)
for k, x in enumerate((18.6, 19.8, 21.0)):
    roll_cage("cage_%d" % k, (x, -11.4, 0), rng.uniform(0.8, 1.4))
styled(cube("intake_zone", (19.0, 0.10, 0.03), loc=(12.5, -9.6, 0.02), cname=SC), "hivis")
styled(cube("intake_zone_end", (0.10, 4.8, 0.03), loc=(3.0, -12.0, 0.02), cname=SC), "hivis")


# --- flat-pack shelving with folded stock: front left and the far x wall ----------
def shelving(name, loc, length, levels=4, depth=0.6, h=2.1, along_y=False):
    """Open steel shelving, flat shelves, folded garments stacked on each:
    the stock that does not hang (knitwear, denim, tees)."""
    bays = int(round(length / 1.2))
    bw = length / bays
    frame, stock = [], {r: [] for r in WARM}

    def p(u, v, z):  # along, across, up -> local x, y, z
        return (v, u, z) if along_y else (u, v, z)

    def s(a, b, c):
        return (b, a, c) if along_y else (a, b, c)

    for b in range(bays + 1):
        u = -length / 2 + b * bw
        for v in (-depth / 2, depth / 2):
            frame.append((s(0.05, 0.05, h), p(u, v, h / 2)))
    for lv in range(levels):
        z = 0.12 + lv * (h - 0.25) / (levels - 1)
        frame.append((s(length, depth, 0.03), p(0, 0, z)))
        if lv == levels - 1:
            continue
        for b in range(bays):
            u0 = -length / 2 + b * bw
            for k in range(3):
                if rng.random() < 0.15:
                    continue
                n = rng.randint(2, 5)
                role = rng.choices(WARM, weights=(3, 3, 3, 2))[0]
                th = 0.06
                stock[role].append((s(0.30, 0.34, n * th),
                                    p(u0 + 0.22 + k * 0.38, rng.uniform(-0.06, 0.06), z + 0.015 + n * th / 2)))
    styled(parts(name + "_frame", frame, loc=loc, cname=SC), "steel_dk")
    for role, bx in stock.items():
        if bx:
            styled(parts("%s_load_%s" % (name, role), bx, loc=loc, cname=SC), role)


shelving("flat_a", (-12.0, -11.0, 0), 13.2)
shelving("flat_b", (-12.0, -13.6, 0), 13.2)
shelving("flat_wall_a", (-21.6, -6.0, 0), 9.6, along_y=True, h=2.6, levels=5)
shelving("flat_wall_b", (-21.6, 4.6, 0), 8.4, along_y=True, h=2.6, levels=5)


# --- the tugger's train, parked at the end of its lane ----------------------------
def garment_trolley(name, loc):
    """A Z-rail trolley of hanging garments, the tugger's load."""
    frame = [((1.6, 0.06, 0.05), (0, 0, 1.75)),
             ((0.05, 0.05, 1.7), (-0.75, 0, 0.9)), ((0.05, 0.05, 1.7), (0.75, 0, 0.9)),
             ((1.6, 0.6, 0.05), (0, 0, 0.18)), ((0.05, 0.6, 0.05), (-0.75, 0, 0.1)),
             ((0.05, 0.6, 0.05), (0.75, 0, 0.1))]
    styled(parts(name + "_frame", frame, loc=loc, cname=SC), "steel")
    garments(name, loc[0] - 0.65, loc[0] + 0.70, loc[1], 1.75, fill_gaps=0.0)


for k, x in enumerate((-17.0, -18.9)):
    garment_trolley("trolley_%d" % k, (x, -4.6, 0))
