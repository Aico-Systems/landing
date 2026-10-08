"""eCommerce: the floor of a fulfilment centre, where orders are picked into
totes, put to their orders and packed into parcels.

Builds the SCENE collection, which export.py writes:
  SCENE   the hall (floor and the two far walls, no roof) and, from the far
          wall to the near side: tote stacks and put-walls (left) and outbound
          roll cages at the dock doors (right); a conveyor loop carrying totes;
          a row of pack stations with the box-size wall behind them; a near
          staging row of totes and parcels on pallets

Everything tall stands at the far side (+y), so the camera (at -y) sees over
the low things in front. The walkways run along x between the bands; the
page's routes (src/lib/verticals.ts) are in the same metres, with z = -y:
  y =  8.6  between the put-walls and the conveyor
  y =  1.4  the main aisle (carts and pallet trucks)
  y = -3.2  the packers' side of the pack stations
  y = -7.0  the near aisle, in front of the box-size wall
"""
exec(compile(open(f"{KIT}/props.py").read(), "props.py", "exec"))

SC = "SCENE"
W, D = 46.0, 30.0
D_WALL_X = W / 2 - 0.15   # the far x wall's inner face

hall_shell("hall", cname=SC, size=(W, D), height=9.0, bay=8.0, roof=False,
           cladding="smooth", wall_fill="white", windows=True)

# --- floor markings: the walkway edges, flush, named to land with the floor ---
for i, y in enumerate((10.0, 7.6, 2.9, -0.1, -4.4, -8.4)):
    lane = cube("lane_%d" % i, (36.0, 0.10, 0.03), loc=(0, y, 0.02), cname=SC)
    styled(lane, "hivis")


# --- totes: the open plastic crates everything travels in ---------------------
TOTE = (0.60, 0.40, 0.30)


def tote_boxes(off=(0, 0, 0), yaw=0.0, size=TOTE):
    """An open crate as five boxes: floor and four walls."""
    l, w, h = size
    t = 0.035
    ox, oy, oz = off
    c, s = math.cos(yaw), math.sin(yaw)
    rel = [((l, w, t), (0, 0, t / 2)),
           ((l, t, h), (0, w / 2 - t / 2, h / 2)),
           ((l, t, h), (0, -w / 2 + t / 2, h / 2)),
           ((t, w, h), (l / 2 - t / 2, 0, h / 2)),
           ((t, w, h), (-l / 2 + t / 2, 0, h / 2))]
    return [(sz, (ox + c * p[0] - s * p[1], oy + s * p[0] + c * p[1], oz + p[2]), (0, 0, yaw))
            for sz, p in rel]


def goods_box(off, yaw, size=(0.36, 0.26, 0.18)):
    """What sits in a tote: one item, peeking over the rim."""
    ox, oy, oz = off
    return [(size, (ox, oy, oz + size[2] / 2 + 0.03), (0, 0, yaw))]


# --- the conveyor loop ----------------------------------------------------------
CONV_Z = 0.80          # belt top
CONV_W = 0.72
LOOP_X = 15.0          # straights run from -LOOP_X to LOOP_X
LOOP_R = 1.5
LOOP_Y = 5.1           # centre line of the loop; runs at LOOP_Y +- LOOP_R


def conveyor():
    bed, frame, ribs = [], [], []
    L = 2 * LOOP_X
    for y in (LOOP_Y - LOOP_R, LOOP_Y + LOOP_R):
        bed.append(((L, CONV_W, 0.10), (0, y, CONV_Z - 0.05)))
        for sy in (-1, 1):
            frame.append(((L, 0.06, 0.16), (0, y + sy * (CONV_W / 2 + 0.03), CONV_Z + 0.02)))
        n = int(L / 2.5)
        for i in range(n + 1):
            x = -LOOP_X + i * L / n
            for sy in (-1, 1):
                frame.append(((0.07, 0.07, CONV_Z - 0.1), (x, y + sy * 0.3, (CONV_Z - 0.1) / 2)))
            frame.append(((0.06, CONV_W, 0.06), (x, y, 0.25)))
        # rollers: the ribs are what make a belt read as a conveyor
        m = int(L / 0.42)
        for i in range(m):
            ribs.append(((0.05, CONV_W - 0.04, 0.03), (-LOOP_X + (i + 0.5) * L / m, y, CONV_Z + 0.005)))
    # the two bends: segments around each half circle, off the loop's centre line
    L, arc = 2 * LOOP_X, math.pi * LOOP_R
    total = 2 * L + 2 * arc
    n = 9
    seg = 2 * LOOP_R * math.sin(math.pi / (2 * n)) * 1.08
    for start in (L, 2 * L + arc):
        for k in range(n):
            px, py, ang = loop_point((start + (k + 0.5) * arc / n) / total)
            cx = LOOP_X if px > 0 else -LOOP_X
            bed.append(((seg, CONV_W, 0.10), (px, py, CONV_Z - 0.05), (0, 0, ang)))
            for rr in (LOOP_R - CONV_W / 2 - 0.03, LOOP_R + CONV_W / 2 + 0.03):
                rx = cx + (px - cx) * rr / LOOP_R
                ry = LOOP_Y + (py - LOOP_Y) * rr / LOOP_R
                frame.append(((seg * rr / LOOP_R * 1.02, 0.06, 0.16), (rx, ry, CONV_Z + 0.02), (0, 0, ang)))
            if k % 3 == 1:
                frame.append(((0.07, 0.07, CONV_Z - 0.1), (px, py, (CONV_Z - 0.1) / 2)))
    b = parts("conv_bed", bed, cname=SC)
    styled(b, "steel_dk")
    f = parts("conv_frame", frame, cname=SC)
    styled(f, "steel")
    r = parts("conv_rollers", ribs, cname=SC)
    styled(r, "white")



def loop_point(u):
    """A point on the loop's centre line, u in 0..1, and its heading."""
    L = 2 * LOOP_X
    arc = math.pi * LOOP_R
    total = 2 * L + 2 * arc
    d = (u % 1.0) * total
    if d < L:                                   # near run, +x
        return (-LOOP_X + d, LOOP_Y - LOOP_R, 0.0)
    d -= L
    if d < arc:                                 # right bend
        a = -math.pi / 2 + d / LOOP_R
        return (LOOP_X + LOOP_R * math.cos(a), LOOP_Y + LOOP_R * math.sin(a), a + math.pi / 2)
    d -= arc
    if d < L:                                   # far run, -x
        return (LOOP_X - d, LOOP_Y + LOOP_R, math.pi)
    d -= L
    a = math.pi / 2 + d / LOOP_R                # left bend
    return (-LOOP_X + LOOP_R * math.cos(a), LOOP_Y + LOOP_R * math.sin(a), a + math.pi / 2)


conveyor()

# totes on the belt, in small trains with gaps, the way a real loop runs
us = []
u = 0.0
i = 0
while u < 1.0 - 0.012:
    us.append(u)
    i += 1
    u += 0.013 if i % 4 else 0.04
for i, u in enumerate(us):
    px, py, h = loop_point(u)
    t = parts("conv_load_%d" % i, tote_boxes((0, 0, 0), 0), loc=(px, py, CONV_Z), rot=(0, 0, h), cname=SC)
    styled(t, "orange" if i % 5 else "orange_lt")
    if i % 3 != 2:
        g = parts("conv_load_%d_item" % i, goods_box((0, 0, 0), 0.25 * ((i % 2) * 2 - 1),
                                                      (0.30 + 0.08 * (i % 2), 0.24, 0.20 + 0.06 * (i % 3))),
                  loc=(px, py, CONV_Z), rot=(0, 0, h), cname=SC)
        styled(g, "brown" if i % 2 else "white")


# the infeed: totes from picking come through the wall onto the loop's bend
IN_X0, IN_X1 = -D_WALL_X, -LOOP_X - LOOP_R - CONV_W / 2
inlen = IN_X1 - IN_X0
inbed = parts("infeed_bed", [((inlen, CONV_W, 0.10), (0, 0, CONV_Z - 0.05))],
              loc=((IN_X0 + IN_X1) / 2, LOOP_Y, 0), cname=SC)
styled(inbed, "steel_dk")
inframe = [((inlen, 0.06, 0.16), (0, sy * (CONV_W / 2 + 0.03), CONV_Z + 0.02)) for sy in (-1, 1)]
for k in range(3):
    xx = -inlen / 2 + 0.4 + k * (inlen - 0.8) / 2
    inframe += [((0.07, 0.07, CONV_Z - 0.1), (xx, sy * 0.3, (CONV_Z - 0.1) / 2)) for sy in (-1, 1)]
inframe += [((0.05, CONV_W - 0.04, 0.03), (-inlen / 2 + (i + 0.5) * 0.42, 0, CONV_Z + 0.005))
            for i in range(int(inlen / 0.42))]
inf = parts("infeed_frame", inframe, loc=((IN_X0 + IN_X1) / 2, LOOP_Y, 0), cname=SC)
styled(inf, "steel")
# the hole in the wall it comes through
port = parts("infeed_port", [((0.2, 1.3, 0.12), (0, 0, 1.55)),
                             ((0.2, 0.12, 1.55), (0, -0.6, 0.78)),
                             ((0.2, 0.12, 1.55), (0, 0.6, 0.78))],
             loc=(IN_X0 + 0.15, LOOP_Y, 0), cname=SC)
styled(port, "steel_dk")
for i, xx in enumerate((IN_X0 + 1.0, IN_X0 + 1.7, IN_X0 + 3.4)):
    t = parts("infeed_load_%d" % i, tote_boxes(), loc=(xx, LOOP_Y, CONV_Z), cname=SC)
    styled(t, "orange")


# --- put-walls: a grid of cubbies, one per order, a light on each -------------
def put_wall(name, x, y, cols=5, rows=4, cell=0.56, depth=0.55):
    wid = cols * cell
    base = 0.32
    hgt = rows * cell
    frame = []
    for c in range(cols + 1):
        frame.append(((0.04, depth, hgt + base + 0.1), (-wid / 2 + c * cell, 0, (hgt + base + 0.1) / 2)))
    for r in range(rows + 1):
        frame.append(((wid + 0.04, depth, 0.035), (0, 0, base + r * cell)))
    for sx in (-1, 1):
        frame.append(((0.40, depth + 0.3, 0.05), (sx * wid / 2, 0, 0.025)))
    fr = parts("%s_frame" % name, frame, loc=(x, y, 0), cname=SC)
    styled(fr, "white")
    lights, lit = [], []
    goods_a, goods_b = [], []
    for c in range(cols):
        for r in range(rows):
            cx = -wid / 2 + (c + 0.5) * cell
            z = base + r * cell
            k = (c * 7 + r * 3 + int(x)) % 6
            (lit if k == 0 else lights).append(((0.12, 0.03, 0.05), (cx, -depth / 2 - 0.015, z + 0.035)))
            if k in (1, 3, 4):
                sz = (0.30 + 0.06 * (k % 2), 0.36, 0.16 + 0.05 * (r % 2))
                (goods_a if k != 4 else goods_b).append((sz, (cx + 0.03 * (c % 2), 0.02, z + 0.02 + sz[2] / 2)))
            elif k == 5:
                # a polybag, flat and wide
                goods_b.append(((0.40, 0.32, 0.08), (cx, 0, z + 0.06)))
    li = parts("%s_lights" % name, lights, loc=(x, y, 0), cname=SC)
    styled(li, "steel_dk")
    if lit:
        on = parts("%s_lit" % name, lit, loc=(x, y, 0), cname=SC)
        styled(on, "hivis")
    if goods_a:
        ga = parts("%s_load_a" % name, goods_a, loc=(x, y, 0), cname=SC)
        styled(ga, "brown")
    if goods_b:
        gb = parts("%s_load_b" % name, goods_b, loc=(x, y, 0), cname=SC)
        styled(gb, "orange_lt")


for i, x in enumerate((-17.4, -13.2, -9.0, -4.8)):
    put_wall("putwall_%d" % i, x, 11.4, cols=6)


# empty totes in nested stacks along the far wall, behind the put-walls
def tote_stack(name, x, y, n):
    boxes = []
    for k in range(n):
        z = k * 0.27
        boxes.append(((0.58, 0.38, 0.25), (0, 0, z + 0.125)))
        boxes.append(((0.64, 0.44, 0.03), (0, 0, z + 0.255)))
    return parts(name, boxes, loc=(x, y, 0), cname=SC)


for i in range(14):
    x = -19.5 + i * 0.95 + (0.35 if i >= 7 else 0)
    for j, yy in enumerate((13.9, 13.3)):
        s = tote_stack("totestack_load_%d_%d" % (i, j), x, yy, 6 + (i * 3 + j) % 4)
        styled(s, "orange" if (i + j) % 3 else "orange_lt")


# --- outbound: dock doors on the far wall, roll cages staged in front ---------
def dock_door(i, x):
    yw = D / 2 - 0.16
    door = parts("dock_%d_door" % i, [
        ((3.0, 0.08, 3.2), (0, -0.04, 1.6)),
    ], loc=(x, yw, 0), cname=SC)
    styled(door, "steel_dk")
    trim = parts("dock_%d_trim" % i, [
        ((0.18, 0.12, 3.5), (-1.59, -0.1, 1.75)),
        ((0.18, 0.12, 3.5), (1.59, -0.1, 1.75)),
        ((3.36, 0.12, 0.2), (0, -0.1, 3.4)),
        ((3.0, 0.06, 0.06), (0, -0.12, 0.9)),
        ((3.0, 0.06, 0.06), (0, -0.12, 1.8)),
        ((3.0, 0.06, 0.06), (0, -0.12, 2.7)),
    ], loc=(x, yw, 0), cname=SC)
    styled(trim, "steel")
    bumper = parts("dock_%d_bumpers" % i, [
        ((0.25, 0.16, 0.35), (-1.25, -0.2, 0.45)),
        ((0.25, 0.16, 0.35), (1.25, -0.2, 0.45)),
    ], loc=(x, yw, 0), cname=SC)
    styled(bumper, "ink")
    # the door's apron, striped
    apron = cube("lane_dock_%d" % i, (3.0, 1.6, 0.03), loc=(x, yw - 0.9, 0.02), cname=SC)
    styled(apron, "hivis")


def roll_cage(name, x, y, k):
    w, d, h = 0.85, 0.72, 1.7
    frame = []
    frame.append(((w, d, 0.05), (0, 0, 0.16)))             # deck
    for sx in (-1, 1):
        for sy in (-1, 1):
            frame.append(((0.06, 0.06, 0.06), (sx * (w / 2 - 0.08), sy * (d / 2 - 0.08), 0.06)))  # castor
    # mesh: posts and rails on three sides (open toward -y, the loading side)
    for sx in (-1, 1):
        for sy in (-1, 1):
            frame.append(((0.03, 0.03, h - 0.18), (sx * w / 2, sy * d / 2, 0.18 + (h - 0.18) / 2)))
    for z in (0.6, 1.05, 1.5, h):
        frame.append(((w, 0.025, 0.025), (0, d / 2, z)))
        for sx in (-1, 1):
            frame.append(((0.025, d, 0.025), (sx * w / 2, 0, z)))
    for i in range(1, 4):
        frame.append(((0.02, 0.02, h - 0.18), (-w / 2 + i * w / 4, d / 2, 0.18 + (h - 0.18) / 2)))
        for sx in (-1, 1):
            frame.append(((0.02, 0.02, h - 0.18), (sx * w / 2, -d / 2 + i * d / 4, 0.18 + (h - 0.18) / 2)))
    cg = parts("%s_cage" % name, frame, loc=(x, y, 0), cname=SC)
    styled(cg, "steel")
    # parcels, stacked to a different height in every cage
    sizes = ((0.40, 0.30, 0.24), (0.32, 0.30, 0.20), (0.36, 0.26, 0.28), (0.30, 0.24, 0.18))
    boxes = []
    levels = 2 + k % 3
    for lv in range(levels):
        z = 0.19 + lv * 0.27
        for c in range(4 if lv < levels - 1 else 2 + k % 2):
            s = sizes[(c + lv + k) % 4]
            boxes.append((s, ((c % 2 - 0.5) * 0.40, ((c // 2) - 0.5) * 0.34, z + s[2] / 2),
                          (0, 0, 0.08 * ((c + lv) % 3 - 1)), 0.01))
    pc = parts("%s_load" % name, boxes, loc=(x, y, 0), cname=SC)
    styled(pc, "brown" if k % 3 else "orange_lt")


for i, x in enumerate((5.5, 11.0, 16.5)):
    dock_door(i, x)
    for j in range(3):
        for r, yy in enumerate((12.5, 11.4)):
            k = i * 6 + j * 2 + r
            if (i, j, r) in ((1, 2, 1), (2, 0, 1)):
                continue  # a gap where a cage has just gone out
            roll_cage("cage_%d_%d_%d" % (i, j, r), x + (j - 1) * 1.0, yy, k)


# --- pack stations --------------------------------------------------------------
PACK_Y = -1.7          # table centre; the packer stands on the -y side


def pack_station(i, x):
    tw, td, tz = 2.2, 0.9, 0.90
    table = parts("pack_%d_table" % i, [
        ((tw, td, 0.05), (0, 0, tz)),
    ], loc=(x, PACK_Y, 0), cname=SC)
    styled(table, "white")
    legs = []
    for sx in (-1, 1):
        for sy in (-1, 1):
            legs.append(((0.06, 0.06, tz), (sx * (tw / 2 - 0.06), sy * (td / 2 - 0.06), tz / 2)))
        # the upright frame at the back, carrying the top shelf
        legs.append(((0.06, 0.06, 1.1), (sx * (tw / 2 - 0.06), td / 2 - 0.06, tz + 0.55)))
    legs.append(((tw - 0.1, td - 0.1, 0.04), (0, 0, 0.25)))               # under-shelf
    legs.append(((tw, 0.34, 0.04), (0, td / 2 - 0.17, tz + 0.75)))          # top shelf
    lg = parts("pack_%d_frame" % i, legs, loc=(x, PACK_Y, 0), cname=SC)
    styled(lg, "steel")
    # scale, monitor arm, printer body: the dark kit on the table
    kit = parts("pack_%d_kit" % i, [
        ((0.42, 0.40, 0.04), (0.55, -0.05, tz + 0.045)),                    # scale plate
        ((0.12, 0.08, 0.06), (0.55, -0.27, tz + 0.04)),                     # its readout
        ((0.05, 0.05, 0.45), (-0.25, 0.32, tz + 0.25)),                     # monitor post
        ((0.06, 0.06, 0.06), (-0.25, 0.32, tz + 0.03)),
        ((0.36, 0.30, 0.22), (-0.80, 0.18, tz + 0.135)),                    # label printer
    ], loc=(x, PACK_Y, 0), cname=SC)
    styled(kit, "steel_dk")
    screen = cube("pack_%d_screen" % i, (0.52, 0.04, 0.32), loc=(x - 0.25, PACK_Y + 0.28, tz + 0.52),
                  rot=(math.radians(-10), 0, 0), cname=SC)
    styled(screen, "blue")
    label = cube("pack_%d_label" % i, (0.12, 0.10, 0.01), loc=(x - 0.80, PACK_Y + 0.0, tz + 0.12),
                 rot=(math.radians(-60), 0, 0), cname=SC)
    styled(label, "white")
    # flat boxes on the under-shelf and tape rolls on the top shelf
    flats = parts("pack_%d_load_flats" % i, [
        ((0.80, 0.60, 0.16), (-0.45, 0, 0.35)),
        ((0.60, 0.50, 0.12), (0.45, 0, 0.33)),
        ((0.50, 0.26, 0.20), (-0.5, td / 2 - 0.17, tz + 0.87)),
        ((0.40, 0.26, 0.14), (0.4, td / 2 - 0.17, tz + 0.84)),
    ], loc=(x, PACK_Y, 0), cname=SC)
    styled(flats, "brown")
    # the order in hand: its tote, and the box it is going into
    tote = parts("pack_%d_load_tote" % i, tote_boxes((-0.10 if i % 2 else 0.1, -0.12, tz + 0.025), 0.0),
                 loc=(x - 0.35, PACK_Y, 0), cname=SC)
    styled(tote, "orange")
    open_box = parts("pack_%d_load_box" % i, [
        ((0.46, 0.34, 0.26), (0.55, -0.05, tz + 0.065 + 0.13)),
        ((0.46, 0.14, 0.02), (0.55, -0.27, tz + 0.33), (math.radians(-50), 0, 0)),
    ], loc=(x, PACK_Y, 0), cname=SC)
    styled(open_box, "orange_lt")


for i, x in enumerate((-15.0, -9.0, -3.0, 3.0, 9.0, 15.0)):
    pack_station(i, x)


# --- box-size wall: flat cardboard on edge in slots, small to large -----------
BOXWALL_Y = -5.6


def box_wall(name, x0, x1, y):
    wid = x1 - x0
    h, d = 1.30, 0.80
    frame = []
    n = int(wid / 0.5)
    for i in range(n + 1):
        frame.append(((0.04, d, h), (x0 + i * wid / n, 0, h / 2)))
    frame.append(((wid, d, 0.04), (x0 + wid / 2, 0, 0.12)))
    frame.append(((wid, 0.05, 0.05), (x0 + wid / 2, -d / 2, h)))
    frame.append(((wid, 0.05, 0.05), (x0 + wid / 2, d / 2, h)))
    fr = parts("%s_frame" % name, frame, loc=(0, y, 0), cname=SC)
    styled(fr, "steel")
    a, b = [], []
    for i in range(n):
        cx = x0 + (i + 0.5) * wid / n
        # flats on edge, a few to a slot; the slots step through the sizes
        hh = 0.40 + 0.70 * ((i * 5) % n) / max(1, n - 1)
        dd = 0.40 + 0.32 * ((i * 3) % 4) / 3
        for k in range(3 + i % 3):
            (a if i % 4 else b).append(((0.03, dd, hh), (cx - 0.15 + k * 0.07, 0.04, 0.14 + hh / 2 - 0.01 * k),
                                        (0, 0.0, 0)))
    sa = parts("%s_load_a" % name, a, loc=(0, y, 0), cname=SC)
    styled(sa, "brown")
    if b:
        sb = parts("%s_load_b" % name, b, loc=(0, y, 0), cname=SC)
        styled(sb, "orange_lt")


for i, (xa, xb) in enumerate(((-17.0, -6.4), (-5.4, 5.4), (6.4, 17.0))):
    box_wall("boxwall_%d" % i, xa, xb, BOXWALL_Y)


# --- near staging: pallets of returns totes and sorted parcels, kept low ------
def pallet_boxes(z=0.0):
    boxes = []
    for i in range(3):
        boxes.append(((1.2, 0.10, 0.10), (0, (i - 1) * 0.45, z + 0.05)))
    for i in range(5):
        boxes.append(((0.12, 1.0, 0.03), ((i - 2) * 0.27, 0, z + 0.115)))
    return boxes


for i, x in enumerate((-15.6, -14.0, -12.4, -6.4, -4.8, 4.8, 6.4, 12.4, 14.0, 15.6)):
    y = -11.2
    p = parts("stage_%d_pallet" % i, pallet_boxes(), loc=(x, y, 0), cname=SC)
    styled(p, "paper")
    goods = []
    if i % 2 == 0:
        for k in range(2 + i % 3):
            for cx in (-0.32, 0.32):
                for cy in (-0.22, 0.22):
                    goods += tote_boxes((cx, cy, 0.13 + k * 0.31), 0.0)
        g = parts("stage_%d_load" % i, goods, loc=(x, y, 0), cname=SC)
        styled(g, "orange")
    else:
        sizes = ((0.5, 0.45, 0.32), (0.42, 0.40, 0.28), (0.55, 0.38, 0.36))
        for k in range(2):
            for cx in (-0.30, 0.30):
                for cy in (-0.24, 0.24):
                    s = sizes[(int(cx * 10) + int(cy * 10) + k) % 3]
                    goods.append((s, (cx, cy, 0.13 + k * 0.38 + s[2] / 2), (0, 0, 0), 0.01))
        g = parts("stage_%d_load" % i, goods, loc=(x, y, 0), cname=SC)
        styled(g, "brown")

# the staging zone's outline
zone = parts("lane_zone", [
    ((36.0, 0.10, 0.03), (0, -9.6, 0.02)),
    ((36.0, 0.10, 0.03), (0, -12.8, 0.02)),
], cname=SC)
styled(zone, "hivis")
