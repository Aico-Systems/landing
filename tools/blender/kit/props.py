"""The reusable marks: tick, cross, colour-swatch row, arrow.

Aperture's films lean on a tiny set of stamps — a checkmark that becomes an X,
a row of the same object in different fills, an arrow that asserts a direction.
They are cheap and they do most of the persuading, so they live in one file and
every other interlude imports them.
"""
# Forked from the Mandy film (Mandy_Marketing, scripts/interlude/I12_kit.py at
# commit 034c7b9) and owned by the landing page from here on: change it here.

import bpy
import math
from mathutils import Vector

# KIT is the kit folder, set by tools/blender/export.py before anything runs
exec(compile(open(f"{KIT}/common.py").read(), "common.py", "exec"))


def tick(name, loc, size=1.0, fill="ink", cname="INT_MISC"):
    """Approval mark. Two strokes, short then long."""
    parts = []
    for i, (dx, dz, ln, rot) in enumerate(((-0.14, -0.08, 0.46, -50),
                                           (0.22, 0.14, 0.86, 42))):
        seg = capsule("%s_%d" % (name, i), 0.055 * size, ln * size,
                      loc=(loc[0] + dx * size, loc[1], loc[2] + dz * size),
                      rot=(0, math.radians(rot), 0), cname=cname, segments=10)
        styled(seg, fill)
        parts.append(seg)
    return parts


def cross(name, loc, size=1.0, fill="orange", cname="INT_MISC"):
    """The rejection mark that replaces the tick. Never explained."""
    parts = []
    for i, rot in enumerate((45, -45)):
        seg = capsule("%s_%d" % (name, i), 0.055 * size, 0.80 * size,
                      loc=loc, rot=(0, math.radians(rot), 0), cname=cname,
                      segments=10)
        styled(seg, fill)
        parts.append(seg)
    return parts


def arrow(name, start, end, fill="ink", width=0.045, head=0.16, cname="INT_MISC"):
    """Straight arrow with a wedge head, drawn in the XZ plane."""
    a, b = Vector(start), Vector(end)
    d = b - a
    shaft_end = a + d * (1.0 - head / max(d.length, 1e-3))
    shaft = capsule(name + "_shaft", width, (shaft_end - a).length,
                    loc=(a + shaft_end) / 2, cname=cname, segments=10)
    ang = math.atan2(d.x, d.z)
    shaft.rotation_euler = (0, ang, 0)
    styled(shaft, fill)
    tip = cube(name + "_head", (head * 0.9, width * 1.2, head * 1.4),
               loc=b, rot=(0, ang, 0), cname=cname)
    styled(tip, fill)
    return [shaft, tip]


def swatches(name, loc, colours, size=0.42, gap=0.14, cname="INT_MISC",
             caption=None):
    """"Available in designer colours." A row of the same shape, different fills.

    The joke only works if the shape is identical every time, so this takes one
    size and refuses to vary it."""
    out = []
    n = len(colours)
    for i, c in enumerate(colours):
        x = loc[0] + (i - (n - 1) / 2) * (size + gap)
        sw = cube("%s_%d" % (name, i), (size, size * 0.35, size * 0.72),
                  loc=(x, loc[1], loc[2]), cname=cname, bevel=size * 0.09)
        styled(sw, c)
        out.append(sw)
    if caption:
        label(caption, (loc[0], loc[1] - 0.05, loc[2] - size * 0.78),
              rot=(math.pi / 2, 0, 0), size=0.14, fill="brown", cname=cname,
              name=name + "_caption")
    return out


def bubble(name, loc, w=1.05, h=0.62, fill="white", dots=3, text=None,
           cname="INT_MISC", tail=-1):
    """Speech bubble with a tail. `text` replaces the three dots.

    The tail and the contents are parented to the body, so moving or popping the
    bubble moves the whole thing — a bubble that travels while its words stay
    behind is the one mistake this shot cannot survive.
    """
    out = []
    body = cube(name, (w, 0.06, h), loc=loc, cname=cname, bevel=h * 0.19)
    styled(body, fill)
    out.append(body)
    t = capsule(name + "_tail", 0.055, 0.34,
                loc=(loc[0] + tail * 0.33, loc[1], loc[2] - h * 0.58),
                rot=(0, math.radians(tail * -28), 0), cname=cname, segments=8)
    styled(t, fill)
    out.append(t)
    if text:
        label(text, (loc[0], loc[1] - 0.05, loc[2]), rot=(math.pi / 2, 0, 0),
              size=h * 0.34, fill="ink", cname=cname, name=name + "_text")
    else:
        for k in range(dots):
            d = ball("%s_dot_%d" % (name, k), 0.052,
                     loc=(loc[0] - 0.26 + k * 0.26, loc[1] - 0.05, loc[2]),
                     cname=cname)
            styled(d, "ink")
            out.append(d)
    for child in out[1:]:
        child.parent = body
        child.matrix_parent_inverse = body.matrix_world.inverted()
    return out


def counter(name, loc, text="00:00", cname="INT_MISC", size=0.34):
    """The running counter, bottom-left, as a physical plate.

    It appears in shots 03, 08 and 68 and is the film's only number, so it is
    the same object every time rather than a comp overlay.
    """
    plate = cube(name, (size * 5.4, 0.06, size * 2.1), loc=loc, cname=cname,
                 bevel=size * 0.18)
    styled(plate, "ink")
    label(text, (loc[0], loc[1] - 0.06, loc[2]), rot=(math.pi / 2, 0, 0),
          size=size, fill="hivis", cname=cname, name=name + "_text")
    return plate


def rack_module(name, loc, bays=4, levels=3, depth=1.1, bay_w=1.9,
                fill="steel_dk", frame_fill="orange", load="brown",
                cname="INT_MISC", load_every=2, detail=2):
    """One run of pallet racking, built rather than bought.

    This is the asset the film cannot download. Every library candidate is
    either a fixed 3x5 bay row or a photoscan of a dirty one, and the film needs
    arbitrary bay counts, three detail tiers, and the palette. It is also the
    asset the wides live or die on: drawn as four boxes per bay the hall reads
    as a toy no matter how well it is lit.

    What actually makes steel racking read, in the order it matters:

      * the bracing. A frame is two uprights with a zigzag of diagonals welded
        between them, and that lattice is the single most recognisable thing
        about a warehouse. Leaving it out was most of why the aisle looked like
        shelving from a catalogue.
      * the beam profile. Box beams sit proud of the upright and step in at the
        ends where the clips are, so the run reads as separate bays rather than
        one continuous shelf.
      * wire decking. Pallet racking is not shelved: the load sits on mesh, and
        the gaps in it are visible from any raised camera, which every isometric
        in this film is.
      * foot plates and frame protectors. The yellow at floor level is the one
        strong colour accent in an otherwise grey hall, and it is what tells you
        the scale of the thing.

    detail=2 builds all of that; 1 drops the deck wires and thins the bracing;
    0 is the old four-box bay, for rows far enough back to be silhouettes.

    Every frame welds into one mesh via parts(): at detail 2 a frame is 30-odd
    boxes, and one object each is how an earlier build reached 40k objects.
    """
    out = []
    x0, y0, z0 = loc
    lift = 0.55                     # first beam level off the floor
    pitch = 0.95                    # level to level
    # The frame stops a little above the top beam, the way a real one does.
    # Sized off levels * pitch it stood a metre and a half proud of the highest
    # load and the run read as a ladder rack.
    h = lift + (levels - 1) * pitch + 0.62
    up_w, up_d = 0.10, 0.078        # upright section

    # --- frames -------------------------------------------------------------
    for b in range(bays + 1):
        x = x0 + (b - bays / 2.0) * bay_w
        boxes = []
        for dy in (-depth / 2, depth / 2):
            # the upright as a C: web plus two returns, so it catches light on
            # three planes instead of reading as a plain post
            boxes.append(((up_w, up_d, h), (0, dy, h / 2)))
            if detail >= 1:
                for sx in (-1, 1):
                    boxes.append(((up_w * 0.22, up_d * 0.34, h),
                                  (sx * up_w * 0.39, dy - up_d * 0.33, h / 2)))
            # foot plate, and the anchor sat on it
            boxes.append(((up_w * 1.9, up_d * 1.9, 0.035), (0, dy, 0.018)))
            if detail >= 2:
                boxes.append(((0.030, 0.030, 0.055), (up_w * 0.55, dy, 0.05)))

        if detail >= 1:
            # the zigzag: diagonals between the two uprights, plus horizontals
            # at every beam level. Angle comes out of the depth and the pitch,
            # so it stays a real lattice at any rack geometry.
            span = depth - up_d
            n = max(2, int(levels * 2))
            seg = h * 0.86 / n
            ang = math.atan2(seg, span)
            diag = math.hypot(seg, span) 
            for i in range(n):
                z = 0.30 + i * seg + seg / 2
                boxes.append(((0.045, diag, 0.045), (0, 0, z),
                              (math.pi / 2 - ang if i % 2 else ang - math.pi / 2, 0, 0)))
            for lv in range(levels + 1):
                boxes.append(((0.045, span, 0.045), (0, 0, 0.30 + lv * (h * 0.86 / levels))))

        frame = parts("%s_rack_%d" % (name, b), boxes,
                      loc=(x, y0, z0), cname=cname)
        styled(frame, fill)
        out.append(frame)

        # frame protector: the yellow at floor level, aisle side only
        if detail >= 2:
            prot = parts("%s_prot_%d" % (name, b),
                         [((up_w * 1.5, 0.07, 0.42), (0, -depth / 2 - 0.05, 0.21)),
                          ((up_w * 1.5, 0.30, 0.07), (0, -depth / 2 + 0.10, 0.03))],
                         loc=(x, y0, z0), cname=cname)
            styled(prot, frame_fill)
            out.append(prot)

    # --- beams and decking --------------------------------------------------
    for lv in range(levels):
        z = z0 + lift + lv * pitch
        for dy in (-depth / 2 + 0.05, depth / 2 - 0.05):
            boxes = []
            for b in range(bays):
                bx = (b - (bays - 1) / 2.0) * bay_w
                # box section with a top lip, stepped in at the clip ends
                boxes.append(((bay_w - up_w, 0.055, 0.115), (bx, 0, 0)))
                boxes.append(((bay_w - up_w, 0.085, 0.022), (bx, 0.012, 0.056)))
            beam = parts("%s_beam_%d_%d" % (name, lv, dy > 0), boxes,
                         loc=(x0, y0 + dy, z), cname=cname)
            styled(beam, fill)
            out.append(beam)

        if detail >= 2:
            # wire deck: longitudinals over the bay, cross wires every 200 mm
            boxes = []
            for i in range(7):
                yy = -depth / 2 + 0.12 + i * (depth - 0.24) / 6.0
                boxes.append(((bays * bay_w, 0.018, 0.018), (0, yy, 0.0)))
            n = int(bays * bay_w / 0.24)
            for i in range(n + 1):
                xx = -bays * bay_w / 2 + i * 0.24
                boxes.append(((0.014, depth - 0.14, 0.014), (xx, 0, -0.016)))
            deck = parts("%s_deck_%d" % (name, lv), boxes,
                         loc=(x0, y0, z + 0.07), cname=cname)
            styled(deck, fill)
            out.append(deck)
        else:
            deck = cube("%s_deck_%d" % (name, lv), (bays * bay_w, depth, 0.04),
                        loc=(x0, y0, z + 0.05), cname=cname)
            styled(deck, fill)
            out.append(deck)

        # --- the load -------------------------------------------------------
        for b in range(bays):
            if (b + lv) % load_every:
                continue
            x = x0 + (b - (bays - 1) / 2.0) * bay_w
            if detail >= 2:
                # a pallet under the goods. Without it the cartons float on the
                # wire and the whole run loses its floor-to-load rhythm.
                boxes = []
                for i in range(3):
                    yy = (i - 1) * (depth * 0.30)
                    boxes.append(((bay_w * 0.66, 0.09, 0.09), (0, yy, 0.0)))
                for i in range(5):
                    xx = (i - 2) * (bay_w * 0.155)
                    boxes.append(((0.10, depth * 0.74, 0.022), (xx, 0, 0.056)))
                pal = parts("%s_load_%d_%d_pallet" % (name, lv, b), boxes,
                            loc=(x, y0, z + 0.14), cname=cname)
                styled(pal, "paper_dk")
                out.append(pal)
                gz = z + 0.20 + 0.31
            else:
                gz = z + 0.31
            if detail >= 2:
                # Cartons, not a block. A single box per bay is the thing that
                # makes a rendered warehouse read as a model of one -- real
                # bays carry a stack of differently sized cases.
                gw, gd = bay_w * 0.62, depth * 0.66
                stack = ((0.52, 0.0, 0.0, 0.30), (0.46, -0.20, 0.30, 0.22),
                         (0.42, 0.22, 0.30, 0.18))
                boxes = [((gw * w, gd, hgt), (gw * dx * 0.5, 0, zz + hgt / 2),
                          (0, 0, 0), 0.012)
                         for w, dx, zz, hgt in stack]
                goods = parts("%s_load_%d_%d" % (name, lv, b), boxes,
                              loc=(x, y0, gz - 0.31), cname=cname)
            else:
                goods = cube("%s_load_%d_%d" % (name, lv, b),
                             (bay_w * 0.62, depth * 0.72, 0.62),
                             loc=(x, y0, gz), cname=cname, bevel=0.03)
            styled(goods, load if (b + lv) % 3 else "orange")
            out.append(goods)
    return out


def dotted_path(name, points, cname="INT_MISC", step=0.26, radius=0.05,
                fill="orange"):
    """A dotted trail through a list of points — how these films draw a route."""
    out = []
    idx = 0
    for a, b in zip(points, points[1:]):
        a, b = Vector(a), Vector(b)
        span = (b - a).length
        n = max(int(span / step), 1)
        for i in range(n):
            p = a.lerp(b, i / float(n))
            d = ball("%s_%03d" % (name, idx), radius, loc=p, cname=cname)
            styled(d, fill)
            out.append(d)
            idx += 1
    return out


def mai_unit(name, loc, rot=(0, 0, 0), scale=1.0, cname="INT_MISC",
             lit="hivis", screen="steel_dk", orb=False, strap=True):
    """The ProGlove MAI, drawn to its real proportions.

    MAI is a back-of-hand companion: 21 mm tall, 65 g. It is a SLIM slab, not a
    brick. What makes it recognisable, in the order it matters on screen:

      * a large glove-compatible touch display filling most of the TOP face
      * four physical buttons along the near edge, usable wearing gloves
      * a multi-range scan engine in the front edge, aimed over the fingers
      * a wrap holding it to the back of the hand

    Everything is parented to one empty, so `rot` tips the whole unit — display,
    buttons and orb together. Building the parts at world offsets instead left
    the display facing front and the orb floating off the top of the device,
    which is exactly how it looked wrong.
    """
    S = scale
    root = bpy.data.objects.new(name, None)
    root.empty_display_type = "PLAIN_AXES"
    root.empty_display_size = 0.2 * S
    link(root, cname)
    root.location = loc
    root.rotation_euler = Euler(rot)
    root.scale = (S, S, S)
    out = [root]

    def part(suffix, size, offset, fill, bevel=0.02):
        o = cube("%s_%s" % (name, suffix), size, loc=(0, 0, 0), cname=cname,
                 bevel=bevel)
        styled(o, fill)
        o.parent = root
        o.location = Vector(offset)
        out.append(o)
        return o

    if strap:
        part("wrap", (1.30, 1.06, 0.16), (0, 0.06, -0.15), "ink", bevel=0.07)
    body = part("body", (1.16, 0.88, 0.17), (0, 0, 0), "orange", bevel=0.05)
    part("display", (0.94, 0.62, 0.03), (0, -0.05, 0.10), screen, bevel=0.015)
    for i in range(4):
        part("btn_%d" % i, (0.15, 0.10, 0.05), (-0.39 + i * 0.26, 0.36, 0.07),
             "steel_dk", bevel=0.015)
    part("scan", (0.46, 0.08, 0.10), (0, -0.47, -0.01), "steel_dk", bevel=0.02)
    part("led", (0.32, 0.05, 0.035), (0, -0.44, 0.09), lit, bevel=0.012)

    if orb:
        # THE orb -- the same sphere, same rings, same orange as the one that
        # rises into the hall, just small and hovering off the display. The
        # earlier "flat scatter of big dots" was a second, worse drawing of
        # Mandy, and the film only has one Mandy.
        dots = dotted_orb(name + "_orb", (0, 0, 0), radius=0.21, rings=9,
                          cname=cname, fill="orange", dot=0.026)
        for d in dots:
            d.parent = root
            d.location = d.location + Vector((0, -0.05, 0.36))
            # no shadow: a hundred dots cast a second, smeared orb onto the
            # display right next to the real one
            d.visible_shadow = False
            out.append(d)
    return out


def mai_hand(name, loc, rot=(0, 0, 0), scale=1.0, cname="INT_MISC", fill="brown"):
    """The hand MAI sits on: a palm and four fingers, parented so it tips with
    the device. Drawn as a mount, not a character."""
    root = bpy.data.objects.new(name, None)
    root.empty_display_type = "PLAIN_AXES"
    root.empty_display_size = 0.2 * scale
    link(root, cname)
    root.location = loc
    root.rotation_euler = Euler(rot)
    root.scale = (scale, scale, scale)

    palm = cube(name + "_palm", (1.55, 1.15, 0.34), loc=(0, 0, 0), cname=cname,
                bevel=0.16)
    styled(palm, fill)
    palm.parent = root
    for k in range(4):
        f = capsule("%s_finger_%d" % (name, k), 0.115, 0.95, cname=cname,
                    segments=10)
        styled(f, fill)
        f.parent = root
        f.location = Vector((0.95, -0.38 + k * 0.25, -0.02 - k * 0.01))
        f.rotation_euler = Euler((0, math.radians(90), 0))
    thumb = capsule(name + "_thumb", 0.13, 0.72, cname=cname, segments=10)
    styled(thumb, fill)
    thumb.parent = root
    thumb.location = Vector((0.30, 0.62, -0.04))
    thumb.rotation_euler = Euler((0, math.radians(74), math.radians(40)))
    return root


def dotted_orb(name, loc, radius=1.0, rings=9, cname="INT_MISC", fill="orange",
               tilt=-20.0, flat=False, dot=None):
    """The assistant, drawn the way the product already draws itself.

    Lifted from the widget's DottedOrb: a lat/long grid of dots on a sphere,
    axis tilted about 20 degrees, ring density falling off with cos(latitude) so
    the poles do not bunch. In the widget the dots breathe with the speaker's
    voice; here they rotate, which is the same idea at film speed.

    `flat=True` drops it to a disc of dots for when it sits on the MAI display
    and has to read at thumbnail size.
    """
    out = []
    r_dot = dot if dot is not None else max(radius * 0.055, 0.012)
    t = math.radians(tilt)
    idx = 0

    if flat:
        # On the display the orb is seen from directly above, so it is drawn as
        # concentric rings in the plane of the screen. Squashing a sphere along
        # the wrong axis just scattered the dots and read as noise.
        for ring in range(rings):
            rr = (ring + 0.5) / float(rings) * radius
            n = max(1, int(round(ring * 2.6 + 1)))
            for j in range(n):
                a = (j / float(n)) * math.pi * 2 + ring * 0.4
                d = ball("%s_%03d" % (name, idx), r_dot,
                         loc=(loc[0] + math.cos(a) * rr,
                              loc[1] + math.sin(a) * rr * 0.62,
                              loc[2]), cname=cname, segments=8)
                styled(d, fill)
                out.append(d)
                idx += 1
        return out
    for i in range(rings + 1):
        lat = -math.pi / 2 + (i / float(rings)) * math.pi
        ring_dots = max(4, int(round(rings * 2.2 * math.cos(lat))))
        for j in range(ring_dots):
            lng = (j / float(ring_dots)) * math.pi * 2
            x = math.cos(lat) * math.cos(lng)
            y = math.cos(lat) * math.sin(lng)
            z = math.sin(lat)
            # tilt about X so the pole leans toward the viewer
            y, z = y * math.cos(t) - z * math.sin(t), y * math.sin(t) + z * math.cos(t)
            if flat:
                y *= 0.12          # squashed to a disc for the display
            d = ball("%s_%03d" % (name, idx), r_dot,
                     loc=(loc[0] + x * radius, loc[1] + y * radius,
                          loc[2] + z * radius), cname=cname, segments=8)
            styled(d, fill)
            out.append(d)
            idx += 1
    return out


def wearable_unit(name, loc, rot=(0, 0, 0), scale=1.0, fill="orange",
                  screen="paper", cname="INT_MISC", lit=None):
    """Deprecated alias — every shot should call mai_unit()."""
    return mai_unit(name, loc, rot=rot, scale=scale, cname=cname,
                    lit=lit or "hivis")


# ===========================================================================
# Assembly
# ===========================================================================
def assemble_drop(objs, t0, per=1.2, fall=24, height=9.0, overshoot=0.16,
                  spread=0.0, appear=True, offset=None):
    """Drop a set of objects in from above, staggered, with a small overshoot.

    The film's assembly mechanic. `per` is the stagger between elements, so a
    rack row lands bay by bay rather than as one slab.

    `offset` is where an element comes FROM, as a vector; the default is
    straight down from `height`. The script's assembly mechanic has elements
    arriving from three axes -- floor from below, racking from the sides, roof
    from above -- and a wall that merely drops into place from a few metres up
    reads as being lowered by a crane. Given an offset that starts it outside
    the frame, it flies in.

    `appear` hides each object until the frame its own drop begins, and it is
    the difference between a plop and a hover. Without it every element sits at
    its start height from frame one -- and in an isometric view "above" is up
    and to the RIGHT, so a whole aisle's worth of racking hangs in the top
    corner of the shot waiting its turn, in full view. Raising the start height
    to get them out of frame does not fix it either: from high enough to be
    off-screen, any sane fall time reads as a slow drift down rather than a
    landing. The fix is to fall a short distance, fast, from nothing.

    Everything else is keyed on location only. The object's resting position is
    recorded on the object itself the first time it is used, because reading
    `obj.location` while animation exists returns whatever the last evaluated
    frame left there — and re-running the build would then compound the offset
    until the whole set flew away.
    """
    def key(o, frame, interp="BEZIER"):
        _key(o, "location", frame, interp)

    # Clear only the keys this call is about to write, not the object's whole
    # animation: shot 01 drops the racking and shot 02 carries the same racking
    # in, and animation_data_clear() in the second wiped the first.
    t_end = int(t0 + len(objs) * per) + fall + 9
    clear_block(objs, int(t0) - 2, t_end)

    for i, o in enumerate(objs):
        if "home_loc" in o:
            base = Vector(o["home_loc"])
        else:
            o["home_loc"] = list(o.location)
            base = o.location.copy()

        start = int(t0 + i * per)
        land = start + fall
        settle = land + 7

        if offset is not None:
            o.location = base + Vector(offset) + Vector((0, 0, (i % 3) * spread))
        else:
            o.location = base + Vector((0, 0, height + (i % 3) * spread))
        key(o, start - 1, "CONSTANT")
        key(o, start)
        if appear:
            o.hide_render = o.hide_viewport = True
            _key(o, "hide_render", start - 1, "CONSTANT")
            _key(o, "hide_viewport", start - 1, "CONSTANT")
            o.hide_render = o.hide_viewport = False
            _key(o, "hide_render", start, "CONSTANT")
            _key(o, "hide_viewport", start, "CONSTANT")
        if offset is not None and overshoot:
            d = Vector(offset)
            d.normalize()
            o.location = base - d * overshoot
        else:
            o.location = base - Vector((0, 0, overshoot))
        key(o, land)
        # CONSTANT on the last key, so the object HOLDS at rest until the next
        # shot keys it. With BEZIER here, a later shot's first key became the
        # far end of an interpolation and the racking drifted off during the
        # tail of this one.
        o.location = base
        key(o, settle, "CONSTANT")
        o.location = base
    return objs


def assembly_order(cname, floor_prefixes=(), frame_prefixes=(), load_prefixes=()):
    """Sort a stage's objects into the order the mechanic calls for:
    floor, then structure, then what sits on it. Anything unmatched lands last.
    """
    c = bpy.data.collections.get(cname)
    if not c:
        return []
    buckets = ([], [], [], [])
    for o in sorted(c.objects, key=lambda x: (x.location.x, x.name)):
        name = o.name
        # load is tested FIRST and by substring: rack_module() names its cartons
        # "AI_rack_0_load_2_3", which also starts with the frame prefix, so a
        # startswith test in the other order put every carton in with the
        # shelves and they all dropped together.
        if load_prefixes and any(t in name for t in load_prefixes):
            buckets[2].append(o)
        elif floor_prefixes and name.startswith(floor_prefixes):
            buckets[0].append(o)
        elif frame_prefixes and name.startswith(frame_prefixes):
            buckets[1].append(o)
        else:
            buckets[3].append(o)
    return buckets


def orb_hold(objs, t0, t1):
    """Freeze an orb mid-state for the length of a narration.

    The orb animates to Mandy's voice only. Where the narrator speaks over a
    shot the orb still has to be IN its state — retrieving, acting, two lobes —
    but not moving through it. So the pose at t0 is held to t1 with constant
    interpolation: attention, not animation.
    """
    prefs = bpy.context.preferences.edit
    prev = prefs.keyframe_new_interpolation_type
    prefs.keyframe_new_interpolation_type = "CONSTANT"
    try:
        for o in objs:
            for path in ("location", "rotation_euler", "scale"):
                try:
                    o.keyframe_insert(path, frame=t0)
                    o.keyframe_insert(path, frame=t1)
                except TypeError:
                    pass
    finally:
        prefs.keyframe_new_interpolation_type = prev
    return objs


def cracked_housing(name, loc=(0, 0, 0), rot=(0, 0, 0), scale=1.0,
                    cname="INT_MISC", body="white"):
    """The cracked polymer housing the worker carries through Act 1.

    Shot 03 is a dead-on insert on this thing -- "hairline fracture across the
    boss, his thumb finds it" -- so it has to survive being looked at, and it
    has to read in shot 02 at roughly the width of the figure's head. A bevelled
    grey box did neither: at distance it was a blob, and up close there was
    nothing to find.

    Two rules came out of drawing it:

    Damage has to be geometry, not a mark. A crack drawn as ink boxes standing
    proud of the surface read as black tabs stuck to a white loaf. Here the near
    mounting boss is modelled as two pieces with a gap between them -- a boss
    snapped in half is unmistakable at any size -- and the fracture running out
    of it is a thin line lying almost flush on the shell, which is what a crack
    looks like from above.

    An all-white part has no interior. Under the flat treatment Freestyle drew
    only silhouettes and creases, so same-fill shapes sitting on each other
    vanished into one blob; under the shaded treatment the same thing happens
    for a different reason -- white plastic under a soft environment has almost
    no shading to separate one form from the next. Either way the answer is
    tone: the mouldings are a darker grey than the shell, and that is what gives
    the part its structure at a glance.

    Built flat: length on X, width on Y, thickness on Z, top face +Z, shell top
    at z = +0.031. Everything parents to one empty, so rot tips the whole part
    and animation is one keyframe on the root.
    """
    S = scale
    root = bpy.data.objects.new(name, None)
    root.empty_display_type = "PLAIN_AXES"
    root.empty_display_size = 0.12 * S
    link(root, cname)
    root.location = loc
    root.rotation_euler = Euler(rot)
    root.scale = (S, S, S)
    out = [root]

    def part(suffix, size, offset, fill, bevel=0.006, rot=(0, 0, 0)):
        o = cube("%s_%s" % (name, suffix), size, cname=cname, bevel=bevel)
        styled(o, fill)
        o.parent = root
        o.location = Vector(offset)
        o.rotation_euler = Euler(rot)
        out.append(o)
        return o

    def post(suffix, radius, length, offset, fill):
        o = capsule("%s_%s" % (name, suffix), radius, length, cname=cname)
        styled(o, fill)
        o.parent = root
        o.location = Vector(offset)
        out.append(o)
        return o

    part("shell", (0.300, 0.200, 0.062), (0, 0, 0), body, bevel=0.024)

    # the strengthening rib down the middle, and three moulded vents beside it
    part("rib", (0.262, 0.030, 0.020), (0, -0.010, 0.038), "steel_dk", bevel=0.007)
    for i, px in enumerate((-0.060, 0.0, 0.060)):
        part("vent_%d" % i, (0.030, 0.052, 0.012), (px, 0.062, 0.030),
             "steel_dk", bevel=0.004)

    # a mounting ear at each end, bolt hole punched through in ink
    for sx in (-1, 1):
        part("ear_%d" % (sx > 0), (0.058, 0.108, 0.028),
             (sx * 0.170, 0, -0.012), body, bevel=0.010)
        post("hole_%d" % (sx > 0), 0.017, 0.048, (sx * 0.178, 0, -0.012), "ink")

    # Two bosses, identical, so the eye compares them: the far one is whole and
    # the near one has the break driven straight through it. Modelling the near
    # boss as two separate blocks instead read as two grey slabs rather than as
    # one round boss that failed.
    post("boss_far", 0.030, 0.078, (-0.090, -0.050, 0.050), "steel_dk")
    post("boss_near", 0.030, 0.078, (0.090, -0.050, 0.050), "steel_dk")
    part("boss_split", (0.007, 0.062, 0.082), (0.090, -0.050, 0.050), "ink",
         bevel=0.0, rot=(0, 0, math.radians(-13)))

    # The fracture runs out of the broken boss along the clear strip in front of
    # it. Routed anywhere else it passes under the rib or the vents and is lost;
    # raising it to clear them turns it back into a black tab standing on the
    # shell, which is what it must not be.
    # More segments, shorter, with small angle changes: three long ones with big
    # kicks drew a bent arrow. It sits 1 mm proud of the shell -- enough to
    # exist, not enough to be a tab.
    for i, (px, py, ln, ang) in enumerate((
            (0.062, -0.058, 0.048, 80.0),
            (0.026, -0.069, 0.040, 96.0),
            (-0.008, -0.063, 0.038, 76.0),
            (-0.041, -0.071, 0.036, 97.0))):
        part("crack_%d" % i, (0.007, ln, 0.008), (px, py, 0.028), "ink",
             bevel=0.0, rot=(0, 0, math.radians(ang)))
    return out


def hall_shell(name, cname="INT_MISC", size=(46.0, 34.0), height=9.0,
               far_x=True, far_y=True, bay=8.0, fill="steel", floor="paper_dk",
               roof_x=-4.0, roof_y=2.0, roof=True, cladding="ribbed", wall_fill="paper",
               band=None, windows=False):
    """The building the racking stands in.

    Every Act 1 set was a slab floating in grey: no walls, no roof, no horizon.
    That is the single reason the shots read as a diorama on a table rather than
    as a hall, and no amount of detail on the racking fixes it -- the reference
    always has floor running past the edge of frame and structure overhead.

    Only the FAR walls are built. In an isometric from +x/-y the camera looks
    toward -x/+y, so a wall on the near sides would stand between the camera and
    everything else; the far ones close the space off and give the aisle
    somewhere to end, which is the whole point of a shot about distance.

    The roof is built only over the FAR quarter, past `roof_x` and `roof_y`.
    An isometric camera at +x/-y sees anything at -x/+y higher up the frame and
    anything overhead in front of what is under it, so a roof spanning the whole
    hall lies across the entire shot like a cargo net. Restricted to the far
    corner it does what a roof should do here: closes the top of frame and gives
    the hall a lid, behind the racking rather than over the lens.

    Roof trusses are welded one mesh each through parts(): a truss is twenty-odd
    members and giving each its own object is how a build reaches forty thousand
    of them.

    Returns every object made, all prefixed name + "_", so the assembly pass can
    treat the shell as one group.

    The landing page gives each vertical a building of its own with the same
    bones: `cladding` "ribbed" (profiled steel, the film's) or "smooth" (flat
    panels: a clean room, a store); `wall_fill` the walls' role; `band` a role
    for a stripe along the walls at door-head height (a store's fascia, a
    plant's safety line), or None; `windows` a row of high windows (dark
    glass) along both walls. Band and windows are named with their wall, so
    they arrive with it.
    """
    W, D = size
    out = []
    x0, x1 = -W / 2, W / 2
    y0, y1 = -D / 2, D / 2

    slab = cube("%s_floor" % name, (W, D, 0.22), loc=(0, 0, -0.11), cname=cname)
    styled(slab, floor)
    out.append(slab)

    # --- walls, far side only ------------------------------------------------
    # Profiled cladding: a plain slab at this scale reads as a backdrop, and the
    # ribs are what give the eye something to measure the hall against.
    def wall(tag, along_y, at):
        boxes = []
        span = D if along_y else W
        if along_y:
            boxes.append(((0.30, span, height), (0, 0, height / 2)))
        else:
            boxes.append(((span, 0.30, height), (0, 0, height / 2)))
        if cladding == "ribbed":
            n = int(span / 1.6)
            for i in range(n + 1):
                u = -span / 2 + i * 1.6
                if along_y:
                    boxes.append(((0.10, 0.09, height * 0.94), (0.19, u, height / 2)))
                else:
                    boxes.append(((0.09, 0.10, height * 0.94), (u, -0.19, height / 2)))
        else:
            # flat panels: only their joints show, every 4 m
            n = int(span / 4.0)
            for i in range(1, n):
                u = -span / 2 + i * 4.0
                if along_y:
                    boxes.append(((0.03, 0.04, height * 0.98), (0.16, u, height / 2)))
                else:
                    boxes.append(((0.04, 0.03, height * 0.98), (u, -0.16, height / 2)))
        loc = (at if along_y else 0, 0 if along_y else at, 0)
        o = parts("%s_wall_%s" % (name, tag), boxes, loc=loc, cname=cname)
        styled(o, wall_fill)
        out.append(o)

        if band:
            z = min(4.2, height * 0.5)
            size = (0.08, span, 0.45) if along_y else (span, 0.08, 0.45)
            off = (0.2, 0, z) if along_y else (0, -0.2, z)
            b = parts("%s_wall_%s_band" % (name, tag), [(size, off)], loc=loc, cname=cname)
            styled(b, band)
            out.append(b)

        if windows:
            panes = []
            k = int(span / 3.2)
            for i in range(k):
                u = -span / 2 + (i + 0.5) * span / k
                size = (0.06, 2.3, 1.1) if along_y else (2.3, 0.06, 1.1)
                off = (0.2, u, height * 0.8) if along_y else (u, -0.2, height * 0.8)
                panes.append((size, off))
            w = parts("%s_wall_%s_windows" % (name, tag), panes, loc=loc, cname=cname)
            styled(w, "steel_dk")
            out.append(w)

        # columns standing proud of it, at bay spacing
        cols = []
        m = int(span / bay)
        for i in range(m + 1):
            u = -span / 2 + i * bay
            if along_y:
                cols.append(((0.42, 0.42, height), (0.36, u, height / 2)))
                cols.append(((0.62, 0.62, 0.10), (0.36, u, 0.05)))
            else:
                cols.append(((0.42, 0.42, height), (u, -0.36, height / 2)))
                cols.append(((0.62, 0.62, 0.10), (u, -0.36, 0.05)))
        c = parts("%s_cols_%s" % (name, tag), cols,
                  loc=(at if along_y else 0, 0 if along_y else at, 0), cname=cname)
        styled(c, fill)
        out.append(c)

    if far_x:
        wall("x", True, x0)
    if far_y:
        wall("y", False, y1)

    # no roof: the landing page's camera looks into the hall from above,
    # where even the far-corner roof sat between it and the racking
    if not roof:
        return out

    # --- roof ---------------------------------------------------------------
    # Trusses across the short axis, purlins along the long one. Kept light:
    # from any of the film's cameras this is a texture along the top of frame,
    # not a subject.
    z = height + 0.4
    ry0, ry1 = max(y0, roof_y), y1
    rd = ry1 - ry0
    n_truss = int((roof_x - x0) / bay)
    for i in range(n_truss + 1):
        x = x0 + i * bay
        boxes = [((0.16, rd, 0.20), (0, 0, z)),
                 ((0.16, rd, 0.20), (0, 0, z + 1.1))]
        steps = max(1, int(rd / 2.2))
        for k in range(steps):
            u = -rd / 2 + (k + 0.5) * 2.2
            boxes.append(((0.10, 2.4, 0.10), (0, u, z + 0.55),
                          (math.radians(24 if k % 2 else -24), 0, 0)))
        t = parts("%s_truss_%d" % (name, i), boxes,
                  loc=(x, (ry0 + ry1) / 2, 0), cname=cname)
        styled(t, fill)
        out.append(t)

    purlins = []
    rw = roof_x - x0
    n_p = max(1, int(rd / 3.0))
    for k in range(n_p + 1):
        y = ry0 + k * 3.0
        purlins.append(((rw, 0.10, 0.14), (0, y - (ry0 + ry1) / 2, z + 1.28)))
    p = parts("%s_purlins" % name, purlins,
              loc=(x0 + rw / 2, (ry0 + ry1) / 2, 0), cname=cname)
    styled(p, fill)
    out.append(p)

    # --- high bays ----------------------------------------------------------
    # Drawn, not lit. This film has no light sources in it: the lamps are part
    # of the ceiling's silhouette and nothing more.
    lamps, shades = [], []
    for i in range(max(1, n_truss)):
        for k in range(2):
            x = x0 + (i + 0.5) * bay
            y = ry0 + (k + 0.5) * (rd / 2.0)
            lamps.append(((0.06, 0.06, 1.0), (x, y, z - 0.5)))
            shades.append(((0.86, 0.86, 0.26), (x, y, z - 1.05), (0, 0, 0), 0.10))
    lm = parts("%s_lamp_stems" % name, lamps, cname=cname)
    styled(lm, fill)
    out.append(lm)
    sh = parts("%s_lamps" % name, shades, cname=cname)
    styled(sh, "white")
    out.append(sh)
    return out


def hand_pictogram(name, loc=(0, 0, 0), scale=1.0, cname="INT_MISC",
                   missing=(), fill="ink", mark="ink"):
    """A hand, drawn the way a safety poster draws one.

    Built in the XZ plane for a FLAT camera, palm on, fingers up, in the same
    vocabulary as the figures: rounded capsules and a bevelled palm, no detail
    that a pictogram would not have.

    `missing` is which fingers are gone -- 0 is the index, 3 the little finger.
    A missing finger is not drawn faintly or crossed out; it is absent, and
    three short dashes stand where it was. That is how a technical drawing says
    "this used to be here", and it reads at a glance without a caption, which
    matters when the line over the top is doing the joke.
    """
    S = scale
    out = []

    def add(o, key=fill):
        styled(o, key)
        out.append(o)
        return o

    palm = cube("%s_palm" % name, (0.40 * S, 0.05 * S, 0.44 * S),
                loc=(loc[0], loc[1], loc[2]), cname=cname, bevel=0.055 * S)
    add(palm)

    # No rotation on any of these. A capsule stands along its own Z, which for a
    # FLAT camera looking down +Y is up the screen -- exactly where a finger
    # goes. Rotating them 90 degrees about X, which is what a first pass did,
    # lays every one of them along the DEPTH axis, and a capsule seen end-on
    # renders as a circle: the hand came out as a pile of black discs.
    wrist = capsule("%s_wrist" % name, 0.105 * S, 0.30 * S, cname=cname,
                    loc=(loc[0], loc[1], loc[2] - 0.34 * S))
    add(wrist)

    # the thumb, off the side and angled in the SCREEN plane, which is a
    # rotation about Y. It is what makes a hand read as a hand.
    thumb = capsule("%s_thumb" % name, 0.055 * S, 0.34 * S, cname=cname,
                    rot=(0, math.radians(62), 0),
                    loc=(loc[0] - 0.30 * S, loc[1], loc[2] - 0.02 * S))
    add(thumb)

    for i in range(4):
        x = loc[0] - 0.147 * S + i * 0.098 * S
        length = (0.30, 0.34, 0.31, 0.23)[i] * S
        z = loc[2] + 0.21 * S + length / 2
        if i in missing:
            # three dashes where it was
            for k in range(3):
                d = cube("%s_gone_%d_%d" % (name, i, k),
                         (0.062 * S, 0.04 * S, 0.026 * S),
                         loc=(x, loc[1], loc[2] + 0.30 * S + k * 0.100 * S),
                         cname=cname)
                add(d, mark)
            continue
        f = capsule("%s_finger_%d" % (name, i), 0.038 * S, length, cname=cname,
                    loc=(x, loc[1], z))
        add(f)
    return out


# ---------------------------------------------------------------------------
# Block-scoped animation, and the rigs the Act 1 redesign needed
# ---------------------------------------------------------------------------

def _fcurves(o):
    """Every fcurve on an object's action, across Blender 5's slotted layout."""
    ad = o.animation_data
    if not ad or not ad.action:
        return []
    act = ad.action
    out = []
    if hasattr(act, "fcurves"):
        out += list(act.fcurves)
    for slot in getattr(act, "slots", []):
        for layer in act.layers:
            for strip in layer.strips:
                cb = strip.channelbag(slot)
                if cb:
                    out += list(cb.fcurves)
    return out


def clear_block(objs, f0, f1):
    """Remove every key between f0 and f1 on these objects, leaving the rest.

    Shots share objects and each owns one block; a shot must be free to re-run
    without erasing what another shot keyed on the same object.
    """
    for o in objs:
        for fc in _fcurves(o):
            for kp in [k for k in fc.keyframe_points if f0 <= k.co.x <= f1]:
                try:
                    fc.keyframe_points.remove(kp)
                except Exception:
                    pass


def _key(o, path, frame, interp):
    """Insert a key and set its interpolation ON THE POINT.

    Setting the "new keyframe interpolation" preference around the insert is
    not reliable: Blender gives a new key the interpolation of the key before
    it on the same curve, so a CONSTANT preference was only honoured on the
    first key and shot 05's three camera cuts slid into each other as one long
    Bezier. The point itself is the only thing that is certain.
    """
    o.keyframe_insert(path, frame=frame)
    for fc in _fcurves(o):
        if fc.data_path != path:
            continue
        for kp in fc.keyframe_points:
            if abs(kp.co.x - frame) < 0.5:
                kp.interpolation = interp


def show_from(objs, f_on, f_off=None):
    """Visible from f_on (and hidden the frame before); optionally off at f_off."""
    for o in objs:
        o.hide_render = o.hide_viewport = True
        _key(o, "hide_render", f_on - 1, "CONSTANT")
        _key(o, "hide_viewport", f_on - 1, "CONSTANT")
        o.hide_render = o.hide_viewport = False
        _key(o, "hide_render", f_on, "CONSTANT")
        _key(o, "hide_viewport", f_on, "CONSTANT")
        if f_off is not None:
            o.hide_render = o.hide_viewport = True
            _key(o, "hide_render", f_off, "CONSTANT")
            _key(o, "hide_viewport", f_off, "CONSTANT")


def hud_ticks(f0, f1, s0, s1, every=10):
    """[(frame, 'mm:ss')] counting from s0 to s1 seconds across f0..f1."""
    out, last = [], None
    f = f0
    while f <= f1:
        u = (f - f0) / max(1, (f1 - f0))
        secs = int(round(s0 + (s1 - s0) * u))
        txt = "%02d:%02d" % (secs // 60, secs % 60)
        if txt != last:
            out.append((f, txt))
            last = txt
        f += every
    return out


def counter_hud(cam, ticks, name="HUD", cname="INT_MISC", until=None):
    """The running counter as a HUD: parented to the shot's camera, bottom
    left, at a size that follows the ortho scale.

    It used to be a plate in the world, and as a prop it was a black slab in
    the aisle -- three metres tall in the wide, half out of frame in the
    insert. Parented to the camera it sits in the same corner at the same size
    in every shot regardless of what the shot is looking at, which is what a
    counter is.

    `ticks` is [(frame, text)]: each distinct text gets its own plate, shown
    from its frame until the next one's.
    """
    for o in [o for o in bpy.data.objects if o.name.startswith(name + "_")]:
        bpy.data.objects.remove(o, do_unlink=True)
    osc = cam.data.ortho_scale
    half_w, half_h = osc / 2.0, osc / 2.0 * 9.0 / 16.0
    size = osc * 0.028
    x = -half_w + osc * 0.085
    y = -half_h + osc * 0.045
    out = []
    for i, (f, text) in enumerate(ticks):
        plate = cube("%s_%02d" % (name, i), (size * 5.0, size * 1.9, 0.01), cname=cname,
                     bevel=size * 0.15)
        styled(plate, "ink")
        plate.parent = cam
        plate.matrix_parent_inverse.identity()
        plate.location = (x, y, -6.0)
        txt = label(text, (0, 0, 0), rot=(0, 0, 0), size=size, fill="hivis",
                    cname=cname, name="%s_%02d_text" % (name, i))
        txt.parent = cam
        txt.matrix_parent_inverse.identity()
        txt.location = (x, y - size * 0.36, -5.9)
        # `until` caps the last tick. Without it, shot 07's held 06:14 stayed
        # visible forever -- and its camera parks where shot 08's wide pose is,
        # so the leftover HUD hung in the middle of the next act's frame.
        f_off = ticks[i + 1][0] if i + 1 < len(ticks) else until
        show_from([plate, txt], f, f_off)
        out += [plate, txt]
    return out


def sheet(name, loc, w=3.6, h=2.0, title="", number="", cname="INT_MISC"):
    """A white drawing sheet standing in the XZ plane for a FLAT camera, with a
    title block bottom right. What a hand looks like when the 1961 build
    documentation drew it."""
    card = cube("%s_card" % name, (w, 0.02, h), loc=loc, cname=cname, bevel=0.006)
    styled(card, "white")
    x0, z0 = loc[0] + w / 2 - 1.25, loc[2] - h / 2 + 0.06
    fy = loc[1] - 0.02
    frame_ = []
    for (a, b) in (((x0, z0), (x0 + 1.19, z0)), ((x0, z0 + 0.30), (x0 + 1.19, z0 + 0.30)),
                   ((x0, z0), (x0, z0 + 0.30)), ((x0 + 1.19, z0), (x0 + 1.19, z0 + 0.30)),
                   ((x0, z0 + 0.15), (x0 + 1.19, z0 + 0.15))):
        frame_.append(_bar("%s_tb_%d" % (name, len(frame_)), (a[0], fy, a[1]),
                           (b[0], fy, b[1]), 0.008, cname))
        styled(frame_[-1], "ink")
    if title:
        label(title, (x0 + 0.06, fy, z0 + 0.225), rot=(math.pi / 2, 0, 0), size=0.058,
              fill="ink", cname=cname, name="%s_title" % name, align="LEFT")
    if number:
        label(number, (x0 + 0.06, fy, z0 + 0.075), rot=(math.pi / 2, 0, 0), size=0.050,
              fill="steel", cname=cname, name="%s_number" % name, align="LEFT")
    return card


def stamp(name, text, loc, size=0.08, fill="ink", cname="INT_MISC", box=True, pad=0.06):
    """A boxed label. The film's "cut on" grammar for a fact arriving."""
    out = []
    t = label(text, loc, rot=(math.pi / 2, 0, 0), size=size, fill=fill, cname=cname,
              name="%s_text" % name)
    out.append(t)
    if box:
        w = size * 0.62 * len(text) + pad * 2
        h = size * 1.1 + pad * 2
        x, y, z = loc
        z += size * 0.36
        for a, b in (((x - w / 2, z - h / 2), (x + w / 2, z - h / 2)),
                     ((x - w / 2, z + h / 2), (x + w / 2, z + h / 2)),
                     ((x - w / 2, z - h / 2), (x - w / 2, z + h / 2)),
                     ((x + w / 2, z - h / 2), (x + w / 2, z + h / 2))):
            bar = _bar("%s_box_%d" % (name, len(out)), (a[0], y, a[1]), (b[0], y, b[1]),
                       0.009, cname)
            styled(bar, fill)
            out.append(bar)
    return out
