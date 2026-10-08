"""Render one of the page's scenes to a PNG, headless, as the page frames it:
the self-check for a scene script when no Blender window is at hand (the
interactive twin is preview.py).

blender -b --factory-startup --python tools/blender/render.py -- <scene> <out.png> [span] [x y] [w h]
  span   metres of floor across the image (default 50); smaller zooms in
  x y    the point to look at (default the middle of the hall)
  w h    pixels (default 1400 900)

Workbench, flat studio light, the page's colours (src/lib/stage/colours.json,
blueprint.css, light theme), orthographic, 30° down, turned 22°.
"""
import bpy, json, math, os, re, sys
from mathutils import Euler, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(f"{HERE}/../..")
args = sys.argv[sys.argv.index("--") + 1:]
name, out = args[0], os.path.abspath(args[1])
span = float(args[2]) if len(args) > 2 else 50.0
look = Vector((float(args[3]), float(args[4]), 1.0)) if len(args) > 4 else Vector((0, 0, 1.0))

# an empty file: the factory scene's cube, camera and light are not ours
bpy.ops.wm.read_factory_settings(use_empty=True)

path = f"{HERE}/scenes/{name}.py"
exec(compile(open(path).read(), path, "exec"), {"__name__": "__main__", "KIT": f"{HERE}/kit"})

css = open(f"{ROOT}/../blueprint/src/blueprint.css").read()
colours = json.load(open(f"{ROOT}/src/lib/stage/colours.json"))


def token(var):
    m = re.search(re.escape(var) + r":\s*rgb\((\d+),\s*(\d+),\s*(\d+)\)", css)
    lin = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return tuple(lin(int(x) / 255) for x in m.groups()) + (1.0,)


theme = colours["themes"]["light"]
for mat in bpy.data.materials:
    if mat.name.startswith("FLAT_"):
        mat.diffuse_color = token(theme[colours["roles"].get(mat.name[5:].split(".")[0], "steel")])

sc = bpy.context.scene
sc.render.engine = "BLENDER_WORKBENCH"
sc.display.shading.light = "STUDIO"
sc.display.shading.color_type = "MATERIAL"
sc.display.shading.show_cavity = True
sc.display.shading.show_object_outline = True
sc.display.shading.object_outline_color = token(theme["ink"])[:3]
sc.world = sc.world or bpy.data.worlds.new("paper")
sc.render.film_transparent = False
sc.display.shading.background_type = "VIEWPORT"
sc.display.shading.background_color = token(theme["paper"])[:3]
sc.render.resolution_x, sc.render.resolution_y = (int(args[5]), int(args[6])) if len(args) > 6 else (1400, 900)
sc.view_settings.view_transform = "Standard"

cam_data = bpy.data.cameras.new("page")
cam_data.type = "ORTHO"
cam_data.ortho_scale = span
cam = bpy.data.objects.new("page", cam_data)
sc.collection.objects.link(cam)
rot = Euler((math.radians(60), 0, math.radians(22)), "XYZ")
cam.rotation_euler = rot
cam.location = look + rot.to_matrix() @ Vector((0, 0, 120))
cam_data.clip_end = 400
sc.camera = cam
sc.render.filepath = out
bpy.ops.render.render(write_still=True)
print("RENDER", out)
