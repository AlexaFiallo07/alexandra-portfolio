# Modelos 3D (`.glb`)

Esta carpeta contiene tres modelos en **glTF Binary (`.glb`)** generados con `npm run generate:models` (geometría procedural + animaciones reales). La app comprueba su presencia con `/api/models/status?file=...` y, si faltan o fallan, usa automáticamente los modelos procedurales de React Three Fiber. Puedes reemplazar cualquiera por una escultura exportada desde Blender con el mismo nombre, sin tocar el código.

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
- Triángulos objetivo para esculturas definitivas: **30k–50k por modelo** para mantener 60 fps. Los GLB incluidos son versiones funcionales ligeras (~8k, ~5.7k y ~12.6k triángulos) para que la integración se vea activa desde ya.
- Materiales PBR suaves (rugosidad alta en piel/hueso, metálico bajo en detalles) para que la iluminación `studio` de drei lea bien sobre `#F4F4F7`.

## Integración en código

- `useGLTF` carga el archivo y `useAnimations` reproduce los clips.
- `<Environment preset="studio" />` se monta **solo en la rama GLB**, con canvas `alpha: true`.
- `src/lib/useModelAvailable.ts` consulta el estado del archivo; `src/components/3d/ModelGate.tsx` precarga y captura errores.
- Si no hay GLB: T-Rex → `HeroTRex3D` procedural; terópodo → `DinoPet3D` procedural; fósil → cráneo procedural en `FossilStudio3D`.

> Estado actual: los tres GLB ya están incluidos, con clips `Idle`/`Run`/`Jump` en el terópodo, `Idle` en el fósil y `Idle`/`Roar` en el T-Rex. `npm run validate:models` comprueba que cargan, que las escalas son válidas y que `PupilL`/`PupilR` existen en el hero.
