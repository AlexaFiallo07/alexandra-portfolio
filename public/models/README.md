# Modelos 3D (`.glb`)

Esta carpeta contiene **dos modelos**: `trex_hero.glb` (robot T-Rex de la vitrina de Stack) y `fossil_skull.glb` (cráneo fósil usado por la vitrina procedural y como respaldo del minijuego). El resto de las figuras —T-Rex con gafas del hero, Stego programador, pterodáctilos, dinosaurios de las tarjetas y PixelRaptor— son procedurales o SVG.

| Archivo | Uso | Clips | Objetos / respaldo |
| --- | --- | --- | --- |
| `trex_hero.glb` | Vitrina del robot T-Rex en *Stack* | `Idle`, `Roar` | Pupilas `PupilL`/`PupilR`; respaldo SVG `HeroTRexFallback` |
| `fossil_skull.glb` | Vitrina del fósil y respaldo de la excavación | `Idle` (opcional) | Cráneo procedural en `FossilStudio3D.tsx` |

La app comprueba cada archivo con `/api/models/status?file=...`. `ModelGate` precarga el GLB y, si falta o falla, monta el respaldo correspondiente. `src/lib/modelFiles.ts` es la única lista blanca de modelos y `npm run validate:models` verifica que ambos carguen con jerarquía, escala, clips y pupilas válidas.

## Regeneración

```bash
npm run generate:models   # regenera solo fossil_skull.glb desde geometría procedural
npm run validate:models   # comprueba los dos GLB incluidos
```

`trex_hero.glb` es el GLB real del modelo [Robot T-Rex #23140](https://blendswap.com/blend/23140) (licencia CC0 declarada por el uploader, no verificada por BlendSwap), preparado con Blender 5.3: 8,82 MB, 116 nodos, 114 mallas, materiales `Robo_*`, clips `Idle`/`Roar` y pupilas `PupilL`/`PupilR`. Está incluido para que la web funcione sin Blender; si quieres regenerarlo:

```powershell
& "C:\Program Files\Blender Foundation\Blender 5.3\blender.exe" -b --python scripts\prepare-blendswap.py -- "assets\blendswap\Robot-T-Rex.blend" "public\models\trex_hero.glb"
```

El `.blend` es un archivo local ignorado por Git. Si sustituyes cualquiera de los dos GLB, exporta con **glTF Binary (`.glb`)**, `+Y Up`, modifiers aplicados y texturas incrustadas.

## Encuadre

Ningún componente depende de posiciones de cámara hardcodeadas. `src/lib/framing.ts` calcula `Box3` + `boundingSphere` y `src/components/3d/AutoFrameRig.tsx` centra la cámara, ajusta `near`/`far` y mantiene la figura completa en todo el rango de zoom (`0.62`–`1.75`). El robot T-Rex mide 2,25 × 4,34 × 12,68 unidades en su escala original, así que el rig aleja la cámara en consecuencia. Se conserva además el override de materiales que tenía en el hero (carcasa grafito, juntas moradas y LED esmeralda en las pupilas), respetando los materiales `Robo_*` del GLB.

## Histórico

Los antiguos GLB de BlendSwap (Plesiosaurus, Gallimimus, Brachiosaurus, compañero robótico y Parasaurolophus) y sus scripts de conversión se retiraron junto con los personajes que ya no aparecen. Las licencias declaradas por sus uploaders no fueron verificadas por BlendSwap y las descargas se hicieron dentro de la cuota gratuita (0 créditos). No quedan credenciales ni esos archivos en el proyecto.
