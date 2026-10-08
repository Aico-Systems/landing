"""Preview one of the page's scenes in a running Blender, as the page shows it.

In Blender's Python console, or over the Blender MCP:
    VERTICAL = "warehouse"; exec(open("<landing>/tools/blender/preview.py").read())

Builds scenes/<VERTICAL>.py into a scene of its own, `landing_<VERTICAL>` (the
file's other scenes are left alone), colours it the way the page does
(src/lib/stage/colours.json, tokens from blueprint.css, light theme) and
frames the viewport like the page's camera: orthographic, 30° down, turned
22° (the page's AZIMUTH in src/lib/stage/stage.ts).
"""
import bpy, json, math, os, re
from mathutils import Euler, Vector

HERE = "/home/nikita/Projects/Aicoyo/landing/tools/blender"
ROOT = os.path.normpath(f"{HERE}/../..")
name = VERTICAL  # noqa: F821  (set by the caller)

# --- a scene of its own -------------------------------------------------------
sc = bpy.data.scenes.get(f"landing_{name}") or bpy.data.scenes.new(f"landing_{name}")
for o in list(sc.objects):
    bpy.data.objects.remove(o, do_unlink=True)
for c in list(sc.collection.children):
    sc.collection.children.unlink(c)
for c in ("SCENE",):
    old = bpy.data.collections.get(c)
    if old:
        for o in list(old.objects):
            bpy.data.objects.remove(o, do_unlink=True)
        bpy.data.collections.remove(old)
bpy.context.window.scene = sc

path = f"{HERE}/scenes/{name}.py"
exec(compile(open(path).read(), path, "exec"), {"__name__": "__main__", "KIT": f"{HERE}/kit"})

# --- the page's colours -------------------------------------------------------
css = open(f"{ROOT}/../blueprint/src/blueprint.css").read()
colours = json.load(open(f"{ROOT}/src/lib/stage/colours.json"))


def token(var):
    m = re.search(re.escape(var) + r":\s*rgb\((\d+),\s*(\d+),\s*(\d+)\)", css)
    r, g, b = (int(x) / 255 for x in m.groups())
    lin = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return (lin(r), lin(g), lin(b), 1.0)


theme = colours["themes"]["light"]
for mat in bpy.data.materials:
    if not mat.name.startswith("FLAT_"):
        continue
    slot = colours["roles"].get(mat.name[5:].split(".")[0], "steel")
    mat.diffuse_color = token(theme[slot])

# --- the page's view ----------------------------------------------------------
for area in bpy.context.screen.areas:
    if area.type != "VIEW_3D":
        continue
    space = area.spaces.active
    shading = space.shading
    shading.type = "SOLID"
    shading.light = "STUDIO"
    shading.color_type = "MATERIAL"
    shading.show_object_outline = False
    shading.show_cavity = True
    shading.background_type = "VIEWPORT"
    shading.background_color = token(theme["paper"])[:3]
    space.overlay.show_floor = False
    space.overlay.show_axis_x = space.overlay.show_axis_y = False
    space.overlay.show_extras = False
    r3d = space.region_3d
    r3d.view_perspective = "ORTHO"
    # three.js az 22° = camera at +x,-y in Blender (z up, glTF flips y)
    r3d.view_rotation = Euler((math.radians(60), 0, math.radians(22)), "XYZ").to_quaternion()
    r3d.view_location = Vector((0, 0, 1))
    r3d.view_distance = 55
print(f"PREVIEW {name}: {len(sc.objects)} objects")
