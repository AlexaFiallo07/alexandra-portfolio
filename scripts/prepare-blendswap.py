"""Prepara un .blend de BlendSwap para el hero del portafolio.

Genera un GLB ligero, con la paleta Studio Light, pupilas `PupilL`/`PupilR`
y clips `Idle`/`Roar`. No modifica el .blend original.

Uso:
  blender -b --python scripts/prepare-blendswap.py -- input.blend output.glb
"""

import math
import os
import sys
from mathutils import Vector

import bpy

SHELL = (0.20, 0.25, 0.33, 1.0)   # #334155 grafito
PLATE = (0.06, 0.46, 0.43, 1.0)   # #0F766E esmeralda
JOINT = (0.49, 0.23, 0.93, 1.0)   # #7C3AED morado
DARK = (0.06, 0.09, 0.16, 1.0)    # #0F172A
GLOW = (0.20, 0.83, 0.60, 1.0)    # #34D399 LED

DROPPED_MODIFIERS = {"SUBSURF", "DATA_TRANSFER", "NODES"}


def make_material(name, color, metallic, roughness, emissive=None, strength=0.0):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    bsdf = material.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = color
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if emissive:
        bsdf.inputs["Emission Color"].default_value = emissive
        bsdf.inputs["Emission Strength"].default_value = strength
    return material


def category(object_name, material_names):
    joined = f"{object_name} {' '.join(material_names)}".lower()
    if "eye" in joined or "lens" in joined:
        return "glow"
    if "carbon" in joined or "cable" in joined:
        return "dark"
    if "panel" in joined or "decal" in joined or "example" in object_name.lower():
        return "plate"
    return "shell"


def normalize_scale(obj):
    """El validador web exige escalas finitas y positivas en todas las mallas."""
    for index, value in enumerate(obj.scale):
        if not math.isfinite(value) or value == 0:
            obj.scale[index] = 1.0
    if any(value < 0 for value in obj.scale):
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        try:
            bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        finally:
            obj.select_set(False)


def apply_modifiers(obj, materials):
    for modifier in list(obj.modifiers):
        if modifier.type in DROPPED_MODIFIERS:
            obj.modifiers.remove(modifier)
            continue
        try:
            bpy.context.view_layer.objects.active = obj
            bpy.ops.object.modifier_apply(modifier=modifier.name)
        except RuntimeError:
            obj.modifiers.remove(modifier)

    polys = len(obj.data.polygons) if obj.data else 0
    if polys > 2000:
        ratio = 0.22 if polys > 10000 else 0.5
        decimate = obj.modifiers.new("WebDecimate", "DECIMATE")
        decimate.ratio = ratio
        try:
            bpy.context.view_layer.objects.active = obj
            bpy.ops.object.modifier_apply(modifier=decimate.name)
        except RuntimeError:
            obj.modifiers.remove(decimate)

    names = [m.name for m in getattr(obj.data, "materials", []) if m]
    key = category(obj.name, names)
    obj.data.materials.clear()
    obj.data.materials.append(materials[key])


def add_pupils(materials):
    eyes = bpy.data.objects.get("eyes")
    if not eyes:
        return []
    corners = [eyes.matrix_world @ Vector(corner) for corner in eyes.bound_box]
    front_y = min(corner.y for corner in corners) - 0.02
    center_z = sum(corner.z for corner in corners) / len(corners)
    half_x = max(abs(corner.x) for corner in corners) * 0.55

    created = []
    for name, x in (("PupilL", -half_x), ("PupilR", half_x)):
        bpy.ops.mesh.primitive_uv_sphere_add(
            segments=12,
            ring_count=8,
            radius=0.055,
            location=(x, front_y, center_z),
        )
        pupil = bpy.context.object
        pupil.name = name
        pupil.data.materials.append(materials["glow"])
        created.append(pupil.name)
    return created


def add_animations():
    scene = bpy.context.scene
    scene.frame_start = 1
    scene.frame_end = 24

    head = bpy.data.objects.get("head")
    if head:
        head.rotation_mode = "XYZ"
        for frame, angle in ((1, 0.0), (12, 0.045), (24, 0.0)):
            head.rotation_euler.x = angle
            head.keyframe_insert(data_path="rotation_euler", frame=frame)
        if head.animation_data and head.animation_data.action:
            head.animation_data.action.name = "Idle"

    jaw = bpy.data.objects.get("jaw_lower")
    if jaw:
        jaw.rotation_mode = "XYZ"
        for frame, angle in ((1, 0.0), (8, -0.32), (16, 0.0), (24, 0.0)):
            jaw.rotation_euler.x = angle
            jaw.keyframe_insert(data_path="rotation_euler", frame=frame)
        if jaw.animation_data and jaw.animation_data.action:
            jaw.animation_data.action.name = "Roar"


def main():
    marker = sys.argv.index("--") if "--" in sys.argv else -1
    args = sys.argv[marker + 1 :] if marker >= 0 else []
    if len(args) < 2:
        raise SystemExit(
            "Uso: blender -b --python scripts/prepare-blendswap.py -- input.blend output.glb"
        )

    source = os.path.abspath(args[0])
    target = os.path.abspath(args[1])
    if not os.path.isfile(source):
        raise SystemExit(f"No existe el archivo: {source}")

    bpy.ops.wm.open_mainfile(filepath=source)

    # Los .blend antiguos tienen objetos fuera de la capa activa; los vinculamos.
    scene_collection = bpy.context.scene.collection
    for obj in list(bpy.data.objects):
        if not obj.users_collection:
            scene_collection.objects.link(obj)

    # Quitamos helpers y pedestal: el hero ya tiene su propia vitrina.
    for obj in list(bpy.data.objects):
        name = obj.name.lower()
        if name.startswith(("cube", "plane", "text", "camera", "light")) or "pedistal" in name:
            bpy.data.objects.remove(obj, do_unlink=True)

    materials = {
        "shell": make_material("Robo_Shell", SHELL, 0.78, 0.30),
        "plate": make_material("Robo_Plate", PLATE, 0.65, 0.34),
        "joint": make_material("Robo_Joint", JOINT, 0.82, 0.25),
        "dark": make_material("Robo_Dark", DARK, 0.72, 0.36),
        "glow": make_material("Robo_Glow", GLOW, 0.25, 0.18, GLOW, 1.8),
    }

    bpy.ops.object.select_all(action="DESELECT")
    before = sum(
        len(obj.data.polygons)
        for obj in bpy.data.objects
        if obj.type == "MESH" and obj.data
    )

    for obj in list(bpy.context.view_layer.objects):
        if obj.type != "MESH" or not obj.data:
            continue
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        normalize_scale(obj)
        apply_modifiers(obj, materials)
        obj.select_set(False)

    # Los cables ya quedaron horneados en sus mallas; las curvas helper y las
    # imágenes huérfanas solo añaden texturas innecesarias al GLB.
    for obj in list(bpy.data.objects):
        if obj.type in {"CURVE", "FONT", "SURFACE", "META", "LATTICE"}:
            bpy.data.objects.remove(obj, do_unlink=True)
    bpy.ops.outliner.orphans_purge(do_recursive=True)

    pupils = add_pupils(materials)
    add_animations()

    after = sum(
        len(obj.data.polygons)
        for obj in bpy.data.objects
        if obj.type == "MESH" and obj.data
    )
    print(f"Poligonos: {before} -> {after} | pupilas: {', '.join(pupils) or 'ninguna'}")

    bpy.ops.export_scene.gltf(
        filepath=target,
        export_format="GLB",
        export_yup=True,
        export_apply=False,
        export_animations=True,
        export_skins=True,
        export_morph=True,
        export_materials="EXPORT",
    )
    print(f"GLB preparado: {target}")


if __name__ == "__main__":
    main()
