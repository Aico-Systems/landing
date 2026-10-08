"""Mass manufacturing: a final-assembly line at an automotive plant.

Builds the SCENE collection, which export.py writes:
  SCENE   the hall (floor and the two far walls, no roof), two lines (a slat
          conveyor carrying car bodies on skillets, a gantry over every station
          with its tool balancer and andon light), the kitting racks along each
          line and the material lane between them

The lines run along x at y = LINES; the stations stand every STATION metres;
the tugger lane runs between them at y = -0.5.
The page's routes (src/lib/verticals.ts) are in the same metres, with z = -y.
"""
exec(compile(open(f"{KIT}/props.py").read(), "props.py", "exec"))

SC = "SCENE"
STATION = 6.0
STATIONS = 6
LINE = STATION * STATIONS + 4.0  # the slats run a little past both ends

hall_shell("hall", cname=SC, size=(46.0, 34.0), height=11.0, bay=8.0, roof=False,
           windows=True, band="hivis")

# --- two lines, a material lane between them ---------------------------------
# Line A on the near side, line B on the far side; the lane between carries
# the tugger trains that feed the kitting racks of both.
LINES = (-7.5, 6.5)


def car_body(name, x, y):
    """A car body on its skillet: boxes only, the way the film draws, but
    softened (heavy bevels on body and cabin, the cabin set back over the
    rear axle) so it reads as a car and not as a crate."""
    skillet = parts("%s_skillet" % name, [
        ((4.6, 2.0, 0.16), (0, 0, 0.26)),
        ((0.30, 2.0, 0.26), (-2.0, 0, 0.13)),
        ((0.30, 2.0, 0.26), (2.0, 0, 0.13)),
    ], loc=(x, y, 0), cname=SC)
    styled(skillet, "steel")
    body = parts("%s_body" % name, [
        ((4.4, 1.80, 0.55), (0, 0, 0.75), (0, 0, 0), 0.14),          # lower body
        ((2.2, 1.58, 0.52), (-0.30, 0, 1.25), (0, 0, 0), 0.22),      # cabin, rounded off
    ], loc=(x, y, 0), cname=SC)
    styled(body, "orange")
    # wheel arches, dark: what makes the silhouette a car at a glance
    arches = parts("%s_arches" % name, [
        ((0.80, 1.84, 0.40), (-1.35, 0, 0.58), (0, 0, 0), 0.08),
        ((0.80, 1.84, 0.40), (1.35, 0, 0.58), (0, 0, 0), 0.08),
    ], loc=(x, y, 0), cname=SC)
    styled(arches, "steel_dk")


def station(tag, x, y):
    """A gantry over the line: two posts and a beam, a tool on a balancer
    hanging over the body, an andon light on the near post."""
    gantry = parts("station_%s_gantry" % tag, [
        ((0.28, 0.28, 4.6), (0, -2.0, 2.3)),
        ((0.28, 0.28, 4.6), (0, 2.0, 2.3)),
        ((0.34, 4.6, 0.34), (0, 0, 4.6)),
        ((0.60, 0.60, 0.08), (0, -2.0, 0.04)),
        ((0.60, 0.60, 0.08), (0, 2.0, 0.04)),
    ], loc=(x, y, 0), cname=SC)
    styled(gantry, "steel")
    tool = parts("station_%s_tool" % tag, [
        ((0.04, 0.04, 1.6), (0, 0, 3.6)),           # the balancer cable
        ((0.34, 0.22, 0.30), (0, 0, 2.7)),          # the nutrunner
    ], loc=(x, y - 0.9, 0), cname=SC)
    styled(tool, "steel_dk")
    andon = cube("station_%s_andon" % tag, (0.22, 0.22, 0.5), loc=(x, y - 2.0, 4.95), cname=SC)
    styled(andon, "hivis")


x0 = -STATION * (STATIONS - 1) / 2
for li, y in enumerate(LINES):
    slats = cube("line_%d_conveyor" % li, (LINE, 2.6, 0.12), loc=(0, y, 0.06), cname=SC)
    styled(slats, "steel_dk")
    for sy in (-1, 1):
        walk = cube("line_%d_walk_%d" % (li, sy), (LINE, 0.10, 0.03), loc=(0, y + sy * 2.3, 0.02), cname=SC)
        styled(walk, "hivis")
    for i in range(STATIONS):
        x = x0 + i * STATION
        station("%d_%d" % (li, i), x, y)
        # a gap in each line, as on a real one, not in the same place twice
        if i != (2 if li == 0 else 4):
            car_body("car_%d_%d" % (li, i), x + 0.4, y)
    # the kitting racks on the lane side, the parts each station needs, in bins
    rack_module("kit_%d" % li, (0, y + (3.9 if li == 0 else -3.9), 0), bays=11, levels=2, depth=1.0,
                bay_w=3.6, cname=SC, detail=1)

# the material lane between the lines, where the tugger trains run
for sy in (-1, 1):
    lane = cube("lane_tugger_%d" % sy, (LINE + 4, 0.10, 0.03), loc=(0, -0.5 + sy * 1.6, 0.02), cname=SC)
    styled(lane, "hivis")
