"""Grocery: a supermarket floor, the shop a store associate walks all day.

Builds the SCENE collection, which export.py writes:
  SCENE   the hall (floor and the two far walls, no roof); four gondola runs
          of shelving down the middle with promotion end caps; open multideck
          fridges along the back wall and two chest-freezer islands in front
          of them; produce tables at the +x end; a bank of checkouts and a
          trolley bay along the near (-y) edge; the backroom strip behind a
          low partition along the -x wall (roll cages, pallets, a baler, the
          dock door); an online-order picking cart parked in an aisle

The aisles run along x; the page's routes (src/lib/verticals.ts) are in the
same metres, with z = -y: the shelf aisles at y = 5.8, 1.0, -3.8, the main
walkway in front of the checkouts at y = -8.4, the fresh aisle along the
fridges at y = 13.5.
"""
import random

exec(compile(open(f"{KIT}/props.py").read(), "props.py", "exec"))

SC = "SCENE"
GOODS = ("orange", "orange_lt", "brown")

hall_shell("hall", cname=SC, size=(46.0, 34.0), height=6.0, bay=8.0, roof=False,
           cladding="smooth", wall_fill="white", band="orange")


def facings(rng, x0, x1, z, depth, hmax, at=(0.0, 0.0)):
    """Products along one shelf from x0 to x1, standing on z: blocks of one
    product (one colour) a facing or a few wide, with the small gaps a real
    shelf has. Returns {colour: [box, ...]} for parts()."""
    out = {c: [] for c in GOODS}
    x = x0 + 0.03
    while x < x1 - 0.2:
        colour = rng.choice(GOODS)
        h = rng.uniform(0.55, 1.0) * hmax
        w = rng.uniform(0.26, 0.46)
        for _ in range(rng.randint(3, 7)):
            if x + w > x1 - 0.03:
                break
            out[colour].append(((w - 0.03, depth, h), (x + w / 2 + at[0], at[1], z + h / 2)))
            x += w
        x += rng.uniform(0.04, 0.22)  # a gap where a line sold through
    return out


def goods(name, boxes_by_colour, loc=(0, 0, 0)):
    for colour, boxes in boxes_by_colour.items():
        if boxes:
            styled(parts("%s_load_%s" % (name, colour), boxes, loc=loc, cname=SC), colour)


def merge(into, more):
    for c, b in more.items():
        into.setdefault(c, []).extend(b)
    return into


# --- gondola runs: double-sided shelving, the aisles between them ------------
GONDOLA_Y = (8.2, 3.4, -1.4, -6.2)
RUN = 24.0          # x from -12 to 12
SECTION = 4.0       # one object per 4 m, so the page's wave runs along the run
G_DEPTH = 1.3       # both shelves, back to back
G_H = 1.75       # low enough to see the people in the aisles over it
SHELF_Z = (0.15, 0.55, 0.95, 1.35)   # base deck and three shelves
SHELF_D = 0.56


def gondola(i, y, rng):
    for s in range(int(RUN / SECTION)):
        x0 = -RUN / 2 + s * SECTION
        xc = x0 + SECTION / 2
        frame = [
            ((SECTION, 0.08, G_H), (0, 0, G_H / 2)),                 # the spine
            ((SECTION, G_DEPTH, 0.14), (0, 0, 0.07)),                # the plinth
            ((SECTION, 0.30, 0.10), (0, 0, G_H + 0.05)),             # the top rail
        ]
        for k in range(int(SECTION / 1.33) + 1):                     # uprights
            u = -SECTION / 2 + k * (SECTION / 3)
            frame.append(((0.06, 0.14, G_H), (u, 0, G_H / 2)))
        for sy in (-1, 1):
            for z in SHELF_Z[1:]:
                frame.append(((SECTION - 0.04, SHELF_D, 0.04), (0, sy * (0.06 + SHELF_D / 2), z)))
                # the price rail on the shelf edge
                frame.append(((SECTION - 0.04, 0.03, 0.07), (0, sy * (0.07 + SHELF_D), z - 0.01)))
        styled(parts("gondola_%d_%d" % (i, s), frame, loc=(xc, y, 0), cname=SC), "white")

        load = {}
        for sy in (-1, 1):
            for lv, z in enumerate(SHELF_Z):
                top = SHELF_Z[lv + 1] - 0.08 if lv + 1 < len(SHELF_Z) else 1.62
                merge(load, facings(rng, -SECTION / 2, SECTION / 2, z + (0.02 if lv else 0.0),
                                    SHELF_D * 0.86, min(0.40, top - z),
                                    at=(0, sy * (0.08 + SHELF_D * 0.47))))
        goods("gondola_%d_%d" % (i, s), load, loc=(xc, y, 0))

    # end caps: a promotion at each end, stacked in one colour
    for sx in (-1, 1):
        x = sx * (RUN / 2 + 0.45)
        cap = [((0.9, G_DEPTH, 0.14), (0, 0, 0.07)),
               ((0.06, G_DEPTH, G_H), (-sx * 0.42, 0, G_H / 2)),
               ((0.9, G_DEPTH, 0.36), (0, 0, G_H + 0.18))]          # the header board
        for z in SHELF_Z[1:]:
            cap.append(((0.8, G_DEPTH - 0.04, 0.04), (0, 0, z)))
        styled(parts("endcap_%d_%d" % (i, sx > 0), cap, loc=(x, y, 0), cname=SC), "white")
        colour = GOODS[(i + (sx > 0)) % 3]
        stack = []
        for z in SHELF_Z:
            for k in range(3):
                stack.append(((0.62, 0.36, 0.36), (0.02 * sx, (k - 1) * 0.40, z + 0.2)))
        styled(parts("endcap_%d_%d_load" % (i, sx > 0), stack, loc=(x, y, 0), cname=SC), colour)


rng = random.Random(7)
for i, y in enumerate(GONDOLA_Y):
    gondola(i, y, rng)


# --- the chilled wall: open multideck fridges along the back wall ------------
F_Y, F_D, F_H, F_W = 15.7, 1.2, 2.5, 2.5
F_X0, F_UNITS = -15.8, 15
for u in range(F_UNITS):
    xc = F_X0 + (u + 0.5) * F_W
    body = [
        ((F_W, 0.12, F_H), (0, F_D / 2 - 0.06, F_H / 2)),           # back
        ((0.06, F_D, F_H), (-F_W / 2 + 0.03, 0, F_H / 2)),          # end panel
        ((F_W, F_D, 0.42), (0, 0, 0.21)),                           # the well
        ((F_W, F_D * 0.75, 0.30), (0, 0.15, F_H - 0.15)),           # canopy
        ((F_W, 0.06, 0.12), (0, -F_D / 2 + 0.03, 0.42)),            # the lip
    ]
    styled(parts("fridge_%d" % u, body, loc=(xc, F_Y, 0), cname=SC), "white")
    shelves = [((F_W - 0.1, 0.12, 0.08), (0, -F_D / 2 + 0.06, 0.06))]  # kick plate
    levels = (0.44, 0.86, 1.26, 1.66)
    for k, z in enumerate(levels[1:]):
        dd = F_D * (0.55 + 0.08 * (2 - k))  # deeper at the bottom, the way they step
        shelves.append(((F_W - 0.1, dd, 0.035), (0, F_D / 2 - 0.12 - dd / 2, z)))
    styled(parts("fridge_%d_shelves" % u, shelves, loc=(xc, F_Y, 0), cname=SC), "steel")
    load = {}
    for k, z in enumerate(levels):
        dd = F_D * 0.6 if k else F_D * 0.8
        merge(load, facings(rng, -F_W / 2 + 0.06, F_W / 2 - 0.06, z + 0.02, dd * 0.8,
                            0.30, at=(0, F_D / 2 - 0.12 - dd / 2)))
    goods("fridge_%d" % u, load, loc=(xc, F_Y, 0))

# chest freezers in the fresh aisle, two islands of four
for j, x0 in enumerate((-12.0, 2.4)):
    for k in range(4):
        xc = x0 + (k + 0.5) * 2.4
        # an open well: the rim, the sides, the divider down the middle
        box = [((2.36, 1.5, 0.50), (0, 0, 0.25)),
               ((2.36, 0.08, 0.36), (0, -0.71, 0.68)), ((2.36, 0.08, 0.36), (0, 0.71, 0.68)),
               ((0.08, 1.5, 0.36), (-1.14, 0, 0.68)), ((0.04, 1.4, 0.30), (0, 0, 0.65)),
               ((2.36, 1.56, 0.08), (0, 0, 0.06))]
        styled(parts("freezer_%d_%d" % (j, k), box, loc=(xc, 11.2, 0), cname=SC), "white")
        load = {}
        for sy in (-1, 1):
            merge(load, facings(rng, -1.08, 1.08, 0.50, 0.58, 0.28, at=(0, sy * 0.34)))
        goods("freezer_%d_%d" % (j, k), load, loc=(xc, 11.2, 0))


# --- produce tables at the +x end, in line with the gondolas -----------------
for i, y in enumerate(GONDOLA_Y[:3]):
    for half, xc in enumerate((16.3, 19.7)):
        table = [((3.1, 1.6, 0.10), (0, 0, 0.70)),
                 ((3.0, 0.06, 0.25), (0, -0.80, 0.82)), ((3.0, 0.06, 0.25), (0, 0.80, 0.82))]
        for lx in (-1.4, 1.4):
            for ly in (-0.65, 0.65):
                table.append(((0.08, 0.08, 0.70), (lx, ly, 0.35)))
        styled(parts("produce_%d_%d" % (i, half), table, loc=(xc, y, 0), cname=SC), "steel_dk")
        crates, fruit = [], {c: [] for c in GOODS}
        for cx in range(4):
            for cy in (-1, 1):
                px, py = -1.14 + cx * 0.76, cy * 0.38
                tilt = (math.radians(-12 * cy), 0, 0)
                crates.append(((0.70, 0.68, 0.18), (px, py, 0.86 + (0.06 if cy > 0 else 0)), tilt))
                colour = GOODS[(cx + cy + i + half) % 3]
                fruit[colour].append(((0.60, 0.58, 0.14), (px, py, 0.98 + (0.06 if cy > 0 else 0)), tilt, 0.05))
        styled(parts("produce_%d_%d_crates" % (i, half), crates, loc=(xc, y, 0), cname=SC), "brown")
        goods("produce_%d_%d" % (i, half), fruit, loc=(xc, y, 0))


# --- checkouts along the near edge, the main walkway in front of them ---------
CO_Y = -11.6
for i, x in enumerate((-9.6, -6.4, -3.2, 0.0, 3.2, 6.4, 9.6)):
    counter = [((0.9, 3.2, 0.92), (0, 0, 0.46)),
               ((0.5, 0.9, 0.80), (0.70, -1.0, 0.40))]                # the bagging well
    styled(parts("checkout_%d" % i, counter, loc=(x, CO_Y, 0), cname=SC), "white")
    belt = cube("checkout_%d_belt" % i, (0.62, 1.8, 0.04), loc=(x, CO_Y + 0.55, 0.94), cname=SC)
    styled(belt, "steel_dk")
    till = parts("checkout_%d_till" % i, [
        ((0.36, 0.30, 0.22), (-0.15, -0.70, 1.03)),                   # the till
        ((0.05, 0.05, 0.36), (-0.15, -0.95, 1.10)),                   # the screen's post
        ((0.36, 0.04, 0.26), (-0.15, -0.95, 1.38), (math.radians(-12), 0, 0)),
        ((0.06, 0.06, 1.40), (0.40, 1.55, 1.62)),                     # the lane light's post
        ((0.10, 0.10, 0.90), (-0.85, -0.1, 0.45)),                    # the cashier's seat
        ((0.40, 0.40, 0.06), (-0.85, -0.1, 0.92)),
    ], loc=(x, CO_Y, 0), cname=SC)
    styled(till, "steel")
    light = cube("checkout_%d_light" % i, (0.30, 0.30, 0.30), loc=(x + 0.40, CO_Y + 1.55, 2.45), cname=SC)
    styled(light, "hivis")
    rack = parts("checkout_%d_rack" % i, [((0.06, 0.06, 1.3), (sx * 0.28, 0, 0.65))
                                          for sx in (-1, 1)] +
                 [((0.62, 0.36, 0.03), (0, 0, z)) for z in (0.3, 0.7, 1.1)],
                 loc=(x + 1.55, CO_Y + 1.25, 0), cname=SC)
    styled(rack, "steel_dk")
    snacks = [((0.18, 0.30, 0.22), (dx, 0, z + 0.12))
              for z in (0.3, 0.7, 1.1) for dx in (-0.2, 0.0, 0.2)]
    styled(parts("checkout_%d_rack_load" % i, snacks, loc=(x + 1.55, CO_Y + 1.25, 0), cname=SC),
           GOODS[i % 3])

# the trolley bay by the door, nested trolleys in two rows
for r, y in enumerate((-12.0, -14.2)):
    boxes = []
    for k in range(7):
        x = 13.4 + k * 0.42
        boxes += [((0.95, 0.62, 0.04), (x, 0, 0.94)),                # the basket's rim
                  ((0.80, 0.56, 0.04), (x - 0.05, 0, 0.42)),          # the basket's floor
                  ((0.04, 0.62, 0.55), (x + 0.45, 0, 0.68)),          # its back
                  ((0.04, 0.70, 0.04), (x + 0.62, 0, 1.12))]          # the handle
    boxes += [((3.6, 0.04, 0.06), (14.9, sy * 0.28, 0.12)) for sy in (-1, 1)]
    styled(parts("trolleys_%d" % r, boxes, loc=(0, y, 0), cname=SC), "steel")
    styled(parts("trolley_bay_%d" % r, [((0.06, 0.06, 1.0), (16.6, sy * 0.4, 0.5)) for sy in (-1, 1)] +
                 [((0.06, 0.86, 0.06), (16.6, 0, 1.0))], loc=(0, y, 0), cname=SC), "steel_dk")

# the door: a hi-vis line across the entrance, the barrier rails either side
door = cube("entrance_line", (6.0, 0.10, 0.03), loc=(17.5, -16.0, 0.02), cname=SC)
styled(door, "hivis")


# --- the backroom strip behind a low partition along the -x wall -------------
BX = -16.6   # the partition
wall = []
for y0, y1 in ((-17.0, -9.0), (-6.0, 5.0), (8.0, 17.0)):    # two door openings
    wall.append(((0.18, y1 - y0, 1.6), (BX, (y0 + y1) / 2, 0.8)))
for yc in (-7.5, 6.5):                                      # strip-curtain frames
    wall.append(((0.18, 0.10, 2.6), (BX, yc - 1.5, 1.3)))
    wall.append(((0.18, 0.10, 2.6), (BX, yc + 1.5, 1.3)))
    wall.append(((0.22, 3.1, 0.20), (BX, yc, 2.6)))
styled(parts("backroom_wall", wall, cname=SC), "paper")
curtains = []
for yc in (-7.5, 6.5):
    for k in range(9):
        curtains.append(((0.03, 0.26, 2.3), (BX, yc - 1.32 + k * 0.33, 1.35)))
styled(parts("backroom_curtains", curtains, cname=SC), "steel")

# the dock door in the -x wall, a roller shutter
shutter = [((0.12, 3.6, 4.0), (0, 0, 2.0))]
for k in range(12):
    shutter.append(((0.16, 3.6, 0.04), (0.02, 0, 0.2 + k * 0.33)))
shutter += [((0.30, 0.20, 4.3), (0.05, sy * 1.9, 2.15)) for sy in (-1, 1)]
styled(parts("backroom_dock", shutter, loc=(-22.55, -3.0, 0), cname=SC), "steel_dk")

marks = []
for y0, y1 in ((-14.5, -6.0), (0.0, 13.0)):            # parking bays for the cages
    marks.append(((0.10, y1 - y0, 0.03), (-18.6, (y0 + y1) / 2, 0.02)))
    marks.append(((0.10, y1 - y0, 0.03), (-21.0, (y0 + y1) / 2, 0.02)))
    for y in (y0, y1):
        marks.append(((2.5, 0.10, 0.03), (-19.8, y, 0.02)))
styled(parts("backroom_marks", marks, cname=SC), "hivis")


def roll_cage(name, x, y, colour, full=0.8):
    """A roll cage: base on castors, mesh sides, the back open, goods inside."""
    w, d, h = 0.75, 0.85, 1.75
    boxes = [((w, d, 0.06), (0, 0, 0.16))]
    for cx in (-1, 1):
        for cy in (-1, 1):
            boxes.append(((0.08, 0.08, 0.12), (cx * (w / 2 - 0.08), cy * (d / 2 - 0.08), 0.06)))
    for sx in (-1, 1):                      # the two mesh sides
        boxes.append(((0.03, d, 0.03), (sx * w / 2, 0, h)))
        for k in range(4):
            boxes.append(((0.03, 0.03, h - 0.18), (sx * w / 2, -d / 2 + k * d / 3, 0.18 + (h - 0.18) / 2)))
        for z in (0.6, 1.1):
            boxes.append(((0.03, d, 0.03), (sx * w / 2, 0, z)))
    for k in range(3):                      # the back
        boxes.append(((0.03, 0.03, h - 0.18), (-w / 2 + (k + 0.5) * w / 3, d / 2, 0.18 + (h - 0.18) / 2)))
    styled(parts("%s" % name, boxes, loc=(x, y, 0), cname=SC), "steel")
    stack, z = [], 0.19
    rr = random.Random(hash(name) & 0xffff)
    while z < 0.2 + full * (h - 0.3):
        hh = rr.uniform(0.22, 0.34)
        stack.append(((w - 0.12, d - 0.14, hh - 0.02), (0, 0, z + hh / 2), (0, 0, rr.uniform(-0.05, 0.05))))
        z += hh
    styled(parts("%s_load" % name, stack, loc=(x, y, 0), cname=SC), colour)


n = 0
for y0, count in ((-13.9, 9), (0.6, 14)):
    for k in range(count):
        if (k * 5 + n) % 7 == 3:
            continue                         # an empty bay where a cage went out
        roll_cage("cage_%d_%d" % (y0 > 0, k), -19.8, y0 + k * 0.92 + 0.46,
                  GOODS[(k + n) % 3], full=0.45 + 0.5 * ((k * 3 + n) % 4) / 3)
    n += 1

# two pallets of cartons inside the dock door, and the baler in the corner
for k, y in enumerate((-4.4, -1.6)):
    pal = [((1.2, 1.0, 0.12), (0, 0, 0.06))]
    styled(parts("dock_pallet_%d" % k, pal, loc=(-21.0, y, 0), cname=SC), "paper_dk")
    stack = []
    for lv in range(3 - k):
        for cx in (-1, 1):
            for cy in (-1, 1):
                stack.append(((0.56, 0.46, 0.38), (cx * 0.29, cy * 0.24, 0.12 + 0.19 + lv * 0.39), (0, 0, 0), 0.015))
    styled(parts("dock_pallet_%d_load" % k, stack, loc=(-21.0, y, 0), cname=SC), GOODS[k])
baler = parts("backroom_baler", [((1.8, 1.4, 2.6), (0, 0, 1.3)), ((1.9, 1.5, 0.3), (0, 0, 2.75)),
                                 ((0.5, 0.3, 0.5), (0.4, -0.85, 1.4))],
              loc=(-21.2, 15.3, 0), cname=SC)
styled(baler, "steel_dk")
bales = parts("backroom_bales_load", [((1.2, 0.9, 0.7), (0, 0, 0.35), (0, 0, 0), 0.03),
                                      ((1.2, 0.9, 0.7), (0, 0, 1.06), (0, 0, 0.1), 0.03)],
              loc=(-19.4, 15.4, 0), cname=SC)
styled(bales, "brown")


# --- the online-order picking cart, parked against a shelf mid-aisle ---------
cart = [((1.3, 0.62, 0.04), (0, 0, 0.18)), ((1.3, 0.62, 0.04), (0, 0, 0.66)),
        ((1.3, 0.62, 0.04), (0, 0, 1.12))]
for cx in (-1, 1):
    for cy in (-1, 1):
        cart.append(((0.04, 0.04, 1.12), (cx * 0.63, cy * 0.29, 0.66)))
        cart.append(((0.10, 0.10, 0.10), (cx * 0.55, cy * 0.24, 0.05)))
cart += [((0.04, 0.04, 0.5), (0.68, sy * 0.24, 1.35)) for sy in (-1, 1)]   # the handle
cart.append(((0.04, 0.56, 0.04), (0.68, 0, 1.58)))
cart.append(((0.14, 0.10, 0.22), (0.62, 0, 1.30)))                          # its scanner
styled(parts("bopis_cart", cart, loc=(-3.5, 2.4, 0), cname=SC), "steel_dk")
totes = [((0.40, 0.56, 0.30), (dx, 0, z + 0.17), (0, 0, 0), 0.02)
         for z in (0.20, 0.68) for dx in (-0.42, 0.0, 0.42)]
styled(parts("bopis_cart_load_totes", totes, loc=(-3.5, 2.4, 0), cname=SC), "orange")
orders = [((0.28, 0.40, 0.16), (dx, 0, 0.98), (0, 0, 0), 0.01) for dx in (-0.42, 0.42)]
styled(parts("bopis_cart_load_orders", orders, loc=(-3.5, 2.4, 0), cname=SC), "orange_lt")
