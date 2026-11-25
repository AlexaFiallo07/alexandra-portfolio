# Modelos 3D (`.glb`)

Esta carpeta espera tres esculturas exportadas desde **Blender en glTF Binary (`.glb`)**. La app comprueba su presencia con `/api/models/status?file=...` y, si no existen o fallan, usa automáticamente los modelos procedurales de React Three Fiber. **No hace falta crear archivos para que el portafolio funcione.**

## Archivos y clips esperados

| Archivo | Uso | Clips | Objetos opcionales |
| --- | --- | --- | --- |
| `theropod_run.glb` | Terópodo que corre en *Sobre mí* | `Idle`, `Run`, `Jump` | — |
| `fossil_skull.glb` | Fósil/cráneo en *Tech Stack* | `Idle` (opcional) | — |
| `trex_hero.glb` | T-Rex del hero | `Idle`, `Roar` | `PupilL`, `PupilR` |

Los nombres de clips se buscan por coincidencia (mayúsculas/minúsculas y partial match). Si falta un clip, se usa el primero disponible; en el caso de `Jump`/`Roar` simplemente no se reproduce y la interacción sigue activa por código.

## Convención Blender → Web

- Exportar con **glTF Binary (`.glb`)**, `+Y Up` y `Apply Modifiers`.
- Incluir animaciones, **skinning** y **shape keys** si los hay; incrustar texturas dentro del GLB.
- Orientación: **+X hacia delante**, modelo centrado y apoyado en `Y = 0`.
- Escala aproximada: el código reencuadra cada modelo automáticamente (`fitModel`), pero conviene exportar cerca de estas medidas:
  - Terópodo: longitud ~2.2 unidades.
  - Fósil: longitud ~1.9 unidades.
  - T-Rex del hero: altura ~2.6 unidades.
- Triángulos objetivo: **30k–50k por modelo** para mantener 60 fps.
- Materiales PBR suaves (rugosidad alta en piel/hueso, metálico bajo en detalles) para que la iluminación `studio` de drei lea bien sobre `#F4F4F7`.

## Integración en código

- `useGLTF` carga el archivo y `useAnimations` reproduce los clips.
- `<Environment preset="studio" />` se monta **solo en la rama GLB**, con canvas `alpha: true`.
- `src/lib/useModelAvailable.ts` consulta el estado del archivo; `src/components/3d/ModelGate.tsx` precarga y captura errores.
- Si no hay GLB: T-Rex → `HeroTRex3D` procedural; terópodo → `DinoPet3D` procedural; fósil → cráneo procedural en `FossilStudio3D`.

> Nota: actualmente **no hay GLB en esta carpeta**; los tres respaldos procedurales son la experiencia por defecto.
