"""Shared toolkit for the flat 2D "Praxisfilm" interlude layer.

The grammar this encodes, taken from the Aperture informational films
(Panels / Bot Trust / Turrets / Boots) and the Portal orientation shorts:

  * flat vector fills, no gradients, one uniform outline weight
  * a small palette plus exactly one accent
  * diagrams ASSEMBLE on screen — parts fly in and lock into place
  * cutaways with leader lines and straight-faced absurd labels
  * a featureless round-head stick figure ("Bendy") who is silent, doubles as
    worker and staff, and to whom things cheerfully happen
  * approval marks: a tick, then an X
  * a row of product colour swatches
  * panel walls that pull back to reveal the arms behind them
  * a conveyor: the product retracts its limbs, gets boxed, box leaves frame

The look is built with flat Emission materials and inverted-hull outlines under
an orthographic camera, so it renders as line art rather than as lit 3D.

Palette is ours, not Aperture's: cream / orange-brown / graphite / hi-vis.
Swapping to any other palette is one dict.
"""
# Forked from the Mandy film (Mandy_Marketing, scripts/interlude/icommon.py at
# commit 034c7b9) and owned by the landing page from here on: change it here.

import bpy
import bmesh
import math
from mathutils import Vector, Euler, Matrix

SCENE_NAME = "PRAXISFILM_2D"

# --- palette -----------------------------------------------------------------
# linear values; these are the 1970s corporate-film colours from the v6 bible
PAL = {
    "paper":     (0.780, 0.735, 0.640),
    "paper_dk":  (0.640, 0.590, 0.500),   # the drop-shadow cream
    "ink":       (0.030, 0.029, 0.027),   # outline / text graphite
    "orange":    (0.640, 0.205, 0.040),
    "orange_lt": (0.800, 0.360, 0.090),
    "brown":     (0.230, 0.115, 0.055),
    "hivis":     (0.850, 0.620, 0.030),
    "steel":     (0.330, 0.335, 0.330),
    "steel_dk":  (0.150, 0.155, 0.155),
    "white":     (0.880, 0.870, 0.840),
    "blue":      (0.075, 0.190, 0.280),   # used sparingly, for screens only
}

# One palette. The film is cream stock, always — no dark frames, no night
# variant, no "lighting". An earlier pass added a night palette to satisfy the
# script's "pre-dawn sodium" and produced a dark, dimensional-looking frame that
# is the opposite of this style. Light is not depicted in this film at all.
OUTLINE_W = 0.012        # world units; uniform across the whole layer


def scene():
    """The scene everything is built into: the active one, which is the one
    the glTF exporter writes (the film builds into a scene of its own)."""
    return bpy.context.scene


def coll(name):
    """Fetch-or-create a collection linked to the interlude scene."""
    sc = scene()
    c = bpy.data.collections.get(name)
    if c is None:
        c = bpy.data.collections.new(name)
    if name not in {x.name for x in sc.collection.children}:
        sc.collection.children.link(c)
    return c


def clear(name):
    c = bpy.data.collections.get(name)
    if c is not None:
        for o in list(c.objects):
            bpy.data.objects.remove(o, do_unlink=True)
    return coll(name)


def link(obj, name):
    for c in list(obj.users_collection):
        c.objects.unlink(obj)
    coll(name).objects.link(obj)
    return obj


# --- flat materials ----------------------------------------------------------
def flat(key_or_rgb, name=None):
    """Emission-only material: renders as a flat fill, no shading at all."""
    rgb = PAL[key_or_rgb] if isinstance(key_or_rgb, str) else key_or_rgb
    mname = name or ("FLAT_%s" % (key_or_rgb if isinstance(key_or_rgb, str)
                                  else "%.2f_%.2f_%.2f" % rgb))
    mat = bpy.data.materials.get(mname)
    if mat is not None:
        # Refresh the colour rather than trusting the cached material. Returning
        # it untouched meant one palette experiment repainted every FLAT_*
        # material and they never came back: the film stayed dark through a full
        # rebuild, because the rebuild never repainted anything.
        if mat.use_nodes:
            em = next((n for n in mat.node_tree.nodes if n.type == "EMISSION"), None)
            if em:
                em.inputs["Color"].default_value = (*rgb, 1.0)
        return mat
    mat = bpy.data.materials.new(mname)
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    out.location = (240, 0)
    em = nt.nodes.new("ShaderNodeEmission")
    em.location = (0, 0)
    em.inputs["Color"].default_value = (*rgb, 1.0)
    em.inputs["Strength"].default_value = 1.0
    nt.links.new(em.outputs["Emission"], out.inputs["Surface"])
    mat.use_backface_culling = False
    return mat


def outline_mat():
    """Ink material for the inverted hull. Backface culling is what makes the
    trick work: the flipped shell is only visible where it pokes out."""
    mat = bpy.data.materials.get("FLAT_outline")
    if mat is not None:
        return mat
    mat = flat("ink", name="FLAT_outline")
    mat.use_backface_culling = True
    return mat


def styled(obj, fill, outline=False, width=None):
    """Give an object its flat fill. `outline=True` adds an inverted-hull edge,
    which is only wanted for deliberate sticker-thick borders — the standard
    line work comes from Freestyle (see I05_lines.py), which holds a constant
    pixel weight across every shot regardless of ortho scale."""
    mat = flat(fill) if isinstance(fill, str) else fill
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    if not outline:
        return obj
    obj.data.materials.append(outline_mat())
    m = obj.modifiers.new("Outline", "SOLIDIFY")
    m.thickness = width or OUTLINE_W
    m.offset = 1.0
    m.use_flip_normals = True
    m.use_rim = False
    m.material_offset = 1
    m.material_offset_rim = 1
    return obj


# --- primitive builders ------------------------------------------------------
def _finish(mesh, name, loc, rot, cname):
    obj = bpy.data.objects.new(name, mesh)
    obj.location = loc
    obj.rotation_euler = Euler(rot)
    link(obj, cname)
    return obj


def cube(name, size, loc=(0, 0, 0), rot=(0, 0, 0), cname="INT_MISC", bevel=0.0):
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    v = bmesh.ops.create_cube(bm, size=1.0)["verts"]
    bmesh.ops.scale(bm, vec=Vector(size), verts=v)
    if bevel > 0:
        bmesh.ops.bevel(bm, geom=list(bm.verts) + list(bm.edges) + list(bm.faces),
                        offset=bevel, segments=2, affect="EDGES", profile=0.5)
    bm.to_mesh(mesh)
    bm.free()
    return _finish(mesh, name, loc, rot, cname)


def parts(name, boxes, loc=(0, 0, 0), rot=(0, 0, 0), cname="INT_MISC"):
    """Weld a list of boxes into ONE mesh object.

    Detailed hard-surface props are made of dozens of small boxes -- a rack
    frame is two uprights, a foot plate each, and a dozen braces -- and giving
    each of them its own object is how an earlier build reached forty thousand
    objects and took Blender down. Each box is (size, offset, rot_euler) or
    (size, offset); the whole thing comes back as a single object.
    """
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    for box in boxes:
        size, off = box[0], box[1]
        r = box[2] if len(box) > 2 else (0.0, 0.0, 0.0)
        bev = box[3] if len(box) > 3 else 0.0
        tmp = bmesh.new()
        v = bmesh.ops.create_cube(tmp, size=1.0)["verts"]
        bmesh.ops.scale(tmp, vec=Vector(size), verts=v)
        if bev > 0:
            bmesh.ops.bevel(tmp, geom=list(tmp.verts) + list(tmp.edges) + list(tmp.faces),
                            offset=bev, segments=1, affect="EDGES", profile=0.5)
        bmesh.ops.rotate(tmp, verts=tmp.verts, cent=(0, 0, 0),
                         matrix=Euler(r).to_matrix())
        bmesh.ops.translate(tmp, verts=tmp.verts, vec=Vector(off))
        m2 = bpy.data.meshes.new("_tmp")
        tmp.to_mesh(m2)
        tmp.free()
        bm.from_mesh(m2)
        bpy.data.meshes.remove(m2)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
    bm.to_mesh(mesh)
    bm.free()
    return _finish(mesh, name, loc, rot, cname)


def capsule(name, radius, length, loc=(0, 0, 0), rot=(0, 0, 0), cname="INT_MISC",
            segments=12):
    """Rounded bar — the whole pictogram vocabulary is made of these."""
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=segments,
                          radius1=radius, radius2=radius, depth=max(length - 2 * radius, 1e-4))
    for sign in (1, -1):
        sph = bmesh.ops.create_uvsphere(bm, u_segments=segments, v_segments=segments // 2,
                                        radius=radius)["verts"]
        bmesh.ops.translate(bm, vec=Vector((0, 0, sign * (length / 2 - radius))), verts=sph)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
    bm.to_mesh(mesh)
    bm.free()
    return _finish(mesh, name, loc, rot, cname)


def disc(name, radius, loc=(0, 0, 0), rot=(0, 0, 0), cname="INT_MISC", segments=32):
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_circle(bm, cap_ends=True, segments=segments, radius=radius)
    bm.to_mesh(mesh)
    bm.free()
    return _finish(mesh, name, loc, rot, cname)


def ball(name, radius, loc=(0, 0, 0), cname="INT_MISC", segments=20):
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=segments, v_segments=segments // 2,
                              radius=radius)
    bm.to_mesh(mesh)
    bm.free()
    return _finish(mesh, name, loc, (0, 0, 0), cname)


FONT_DIR = "/home/nikita/.local/share/fonts/Google Fonts/Inter"
FONT_FILES = {"regular": FONT_DIR + "/Inter_Regular.20.ttf",
              "medium": FONT_DIR + "/Inter_Medium.20.ttf",
              "semibold": FONT_DIR + "/Inter_SemiBold.20.ttf"}


def font(weight="medium"):
    """Load Inter once and reuse it.

    Blender's built-in Bfont is a low-resolution fallback: at these sizes its
    curves read as ragged, which is where the "pixely" edges came from. Inter is
    already on this machine and is the same family the product UI uses.
    """
    path = FONT_FILES.get(weight, FONT_FILES["medium"])
    for f in bpy.data.fonts:
        if f.filepath == path:
            return f
    try:
        return bpy.data.fonts.load(path)
    except RuntimeError:
        return None


def label(body, loc, rot=(math.pi / 2, 0, 0), size=0.12, fill="ink",
          cname="INT_LABELS", align="CENTER", name=None, extrude=0.0,
          weight="medium"):
    """Flat text, set in Inter.

    Extrusion defaults to zero and every text object is also linked into
    NO_LINES, which the Freestyle linesets exclude. Extruded glyphs grow side
    faces, and Freestyle then strokes every one of them — that is what made the
    type look furry and artefacted rather than crisp.
    """
    cu = bpy.data.curves.new(name or ("TXT_" + body[:20]), type="FONT")
    cu.body = body
    cu.size = size
    f = font(weight)
    if f:
        cu.font = f
    cu.resolution_u = 4
    cu.align_x = align
    cu.align_y = "CENTER"
    cu.extrude = extrude
    ob = bpy.data.objects.new(name or ("TXT_" + body[:20]), cu)
    ob.location = loc
    ob.rotation_euler = Euler(rot)
    ob.data.materials.append(flat(fill))
    link(ob, cname)
    coll("NO_LINES").objects.link(ob)      # excluded from the Freestyle passes
    return ob


def _bar(name, a, b, width, cname):
    """One straight segment of line work between two points."""
    a, b = Vector(a), Vector(b)
    d = b - a
    bar = capsule(name, width, max(d.length, 1e-3), loc=(a + b) / 2, cname=cname,
                  segments=8)
    z = d.normalized()
    up = Vector((0, 0, 1)) if abs(z.z) < 0.99 else Vector((1, 0, 0))
    x = up.cross(z).normalized()
    y = z.cross(x)
    bar.rotation_euler = Matrix((x, y, z)).transposed().to_euler()
    styled(bar, "ink")
    return bar


def leader(name, start, end, cname="INT_LABELS", width=0.008, dot=0.022,
           elbow=0.0):
    """Leader line with a dot at the part end — the diagram's punctuation.

    With `elbow` set, the line runs diagonally out of the part and then flat
    into the label, which is how every technical plate does it and is far
    easier to read than a single long diagonal."""
    a, b = Vector(start), Vector(end)
    parts = []
    if elbow:
        knee = Vector((b.x - math.copysign(abs(elbow), b.x - a.x), b.y, b.z))
        parts.append(_bar(name + "_a", a, knee, width, cname))
        parts.append(_bar(name + "_b", knee, b, width, cname))
    else:
        parts.append(_bar(name, a, b, width, cname))
    knob = ball(name + "_dot", dot, loc=a, cname=cname, segments=12)
    styled(knob, "ink")
    parts.append(knob)
    return parts


def paper_shadow(obj, offset=(0.05, 0.0, -0.05), colour="paper_dk"):
    """Duplicate an object as a flat darker silhouette behind it. This is the
    construction-paper cutout cue — cheaper and more honest than a real shadow,
    which flat emission shading cannot cast anyway."""
    dup = obj.copy()
    dup.data = obj.data.copy()
    dup.name = obj.name + "_shadow"
    dup.location = obj.location + Vector(offset)
    dup.modifiers.clear()
    link(dup, obj.users_collection[0].name if obj.users_collection else "INT_MISC")
    dup.data.materials.clear()
    dup.data.materials.append(flat(colour))
    return dup


# --- stages ------------------------------------------------------------------
# Every interlude is built at the world origin and then moved onto its own
# stage, so they can all live in one scene without colliding and a camera can
# be pointed at any of them.
STAGES = {}
# One long row: every stage gets its own X and they all sit on y=0.
#
# This is not cosmetic. A FLAT camera looks down +Y from behind, so anything
# sharing that stage's X at a greater Y renders straight through it — the first
# grid put Act 2 directly behind Act 3 and every display shot came back with
# racking growing out of it.
_STAGE_ORDER = ['hall', 'panelwall', 'assembly', 'diagram', 'doors', 'memory', 'card', 'language', 'railway', 'endcard', 'switches', 'team', 'colours', 'walk_aisle', 'walk_plan', 'walk_desk', 'shift', 'office_door', 'channels', 'scan', 'answer', 'sop', 'refuse', 'binders', 'pallet', 'voss', 'kitting', 'sms', 'report', 'ticket', 'twoshot', 'call',
                'board', 'flow', 'monitor', 'roles', 'audit', 'portraits', 'postcard', 'serverdoor',
                'sandbox', 'part_insert', 'walk_office', 'walk_chart', 'invoke']
for _i, _name in enumerate(_STAGE_ORDER):
    # 140, not 50. Fifty was safe when the widest camera was ortho 29; at the
    # hall wide's ortho 60 the neighbouring stage's ink walls poked into the
    # bottom corner of frame -- an isometric projects a neighbour 50 away to
    # about 21 screen units, well inside a 30-unit half-frame.
    STAGES[_name] = (_i * 140.0, 0.0, 0.0)


def place(cname, stage):
    """Shift every root object of a collection onto its stage."""
    off = Vector(STAGES[stage])
    c = bpy.data.collections.get(cname)
    if c is None:
        return off
    for o in c.objects:
        if o.parent is None:
            o.location = o.location + off
    return off
