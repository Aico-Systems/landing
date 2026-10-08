"""The warehouse: the hall of the Mandy film's opening shot, built at the
origin for the landing page (forked from the film's A1_walk.py aisle).

Builds the SCENE collection, which export.py writes:
  SCENE   the hall shell (floor and the two far walls, no roof), the floor
          lanes and three pairs of rack runs

The aisles run along x; the page's routes (src/lib/verticals.ts) are in the
same metres: three aisles at z = 0 and ±5.4 (Blender y, flipped by glTF).
"""
exec(compile(open(f"{KIT}/props.py").read(), "props.py", "exec"))

AISLE = 3.4
SC = "SCENE"

hall_shell("hall", cname=SC, size=(46.0, 34.0), height=9.0, bay=8.0, roof=False)

for sy in (-1, 1):
    lane = cube("lane_%d" % sy, (34.0, 0.10, 0.03), loc=(0, sy * (AISLE / 2 - 0.2), 0.02), cname=SC)
    styled(lane, "hivis")

# Three pairs of runs: the near pair in full detail, the rows behind a tier
# lower (the film's reasoning: from most angles they are a silhouette).
ROWS = ((2.4, 7, 2), (8.4, 9, 1), (14.4, 9, 1))
for i, (y, bays, detail) in enumerate(ROWS):
    for sy in (-1, 1):
        if sy > 0 and y > 15.0:
            continue  # +y is the far wall; nothing behind it
        rack_module("rack_%d_%d" % (i, sy > 0),
                    (0, sy * (AISLE / 2 + 0.7) + (0 if i == 0 else sy * (y - 2.4)), 0),
                    bays=bays, levels=3, depth=1.2, bay_w=3.6, cname=SC, detail=detail)
