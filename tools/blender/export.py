"""Build one of the landing page's 3D scenes and export it for the page.

blender -b --factory-startup --python tools/blender/export.py -- <scene>
-> static/models/<scene>.glb   the scene's SCENE collection

A scene is a script in scenes/ (one per vertical) built from the kit in kit/
(forked from the Mandy film): flat-coloured boxes and capsules with film
material roles (FLAT_paper, FLAT_ink, …) that the page recolours from
blueprint's tokens. Lines and lighting are the page's, not Blender's.
"""
import bpy, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
KIT = f"{HERE}/kit"
OUT = os.path.normpath(f"{HERE}/../../static/models")
name = sys.argv[sys.argv.index("--") + 1]
os.makedirs(OUT, exist_ok=True)

path = f"{HERE}/scenes/{name}.py"
exec(compile(open(path).read(), path, "exec"), {"__name__": "__main__", "KIT": KIT})


def export(collection, file):
    c = bpy.data.collections[collection]
    objs = list(c.all_objects)
    for o in bpy.context.scene.objects:
        o.select_set(o in objs)
    out = f"{OUT}/{file}.glb"
    bpy.ops.export_scene.gltf(filepath=out, use_selection=True, export_format="GLB", export_apply=True,
                              export_animations=False, export_yup=True,
                              export_draco_mesh_compression_enable=True)
    meshes = [o for o in objs if o.type == "MESH"]
    print("EXPORT", json.dumps({
        "file": f"{file}.glb", "kb": os.path.getsize(out) // 1024, "objects": len(objs),
        "materials": sorted({s.material.name for o in meshes for s in o.material_slots if s.material}),
    }))


export("SCENE", name)
