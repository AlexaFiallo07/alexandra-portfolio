# Yacimiento paleontológico 3D

Minijuego de excavación: acento creativo permitido dentro de *Stack*. Se monta desde `src/components/sections/StackSection.tsx` y cae al excavador 2D (`../FossilDigGame.tsx`) si no hay WebGL. Los especímenes del catálogo son fósiles del propio minijuego, no personajes adicionales del sitio.

## Estructura

| Archivo | Responsabilidad |
| --- | --- |
| `ExcavationGame.tsx` | Shell de React: estado, herramientas, HUD, tarjeta y detección WebGL. |
| `ExcavationScene.tsx` | `<Canvas>` con sombras suaves, HDRI procedural, caja de campo y rig de encuadre. |
| `Terrain.tsx` | Malla 128×96 deformable, color por profundidad, raycasting y progreso. |
| `Fossil.tsx` | Fósiles procedurales, loader GLB opcional, emergencia e inspección 360°. |
| `fossilGeometry.ts` | Tubos cónicos curvados (garra, mandíbula, espiral, apófisis). |
| `textures.ts` | Mapas PBR procedurales (albedo, normal, roughness, AO) de tierra, hueso y madera. |
| `DustBurst.tsx` | 320 partículas de polvo con shader propio, gravedad y vida. |
| `useExcavation.ts` | Ciclo excavar → emerger → inspeccionar → siguiente, con especímenes aleatorios. |
| `catalog.ts` | Especies, período, dato curioso y configuración de enterramiento. |
| `constants.ts` | Tamaño del lecho, densidad de malla, profundidad máxima y umbral (88 %). |
| `ToolBar.tsx` / `DiscoveryCard.tsx` | Interfaz glassmorphism y tarjeta de hallazgo. |

## Controles

- **Pincel** (`1`): radio 0.54, capas finas y amplias; no daña el fósil.
- **Cincel** (`2`): radio 0.21, retira tierra compacta ~3× más rápido.
- Arrastra sobre la caja para excavar. Al 88 % el hueso se limpia y emerge.
- En la inspección, arrastra para girarlo 360° y usa **→ Siguiente excavación** para otra partida.

## Cámara y encuadre

`ExcavationScene.tsx` monta `src/components/3d/AutoFrameRig.tsx` sobre un grupo que contiene solo el yacimiento (caja, terreno, fósil y polvo). El rig calcula `Box3` y `boundingSphere`, conserva la mirada inclinada original mediante `direction: (0, 3.05, 4.35)` y ajusta `near`/`far` para que la caja complete se vea con margen. El contenedor de `ExcavationGame.tsx` usa `overflow-hidden` solo para redondear la tarjeta: la cámara ya deja un 10 % de margen, así que ningún borde se corta.

## Iluminación y materiales

- HDRI **procedural** con `<Environment resolution={256} frames={1}>` y tres `<Lightformer>` (clave blanca, relleno cálido, rim morado). No depende de la red.
- Sol direccional con `castShadow`, mapa de sombras 2048², `shadow-normalBias` y Canvas `shadows="soft"`.
- Cada material usa `map`, `normalMap`, `roughnessMap` y `aoMap` generados por ruido fBm determinista en `textures.ts` y cacheados en módulo.

Para cambiar el HDRI, sustituye el bloque `<Environment>` por `<Environment preset="studio" environmentIntensity={0.8} />` o por un `.hdr` propio en `public/hdri/`.

## Reemplazar los fósiles procedurales por modelos `.glb` reales

1. Exporta tu modelo desde Blender en **glTF Binary (`.glb`)**: `+Y Up`, modifiers aplicados, ≈2 unidades de largo, orientación **+X al frente**, centrado y apoyado en `Y = 0`, con texturas PBR incrustadas y 30k–50k triángulos como objetivo.
2. Copia el archivo a `public/models/` y añade la ruta al fósil correspondiente en `catalog.ts` mediante `glb: '/models/mi-fosil.glb'`.
3. `Fossil.tsx` usa `useGLTF` dentro de `<Suspense>` y un `GlbErrorBoundary`; si el archivo falla, vuelve al fósil procedural sin romper la partida.

Si sustituyes el fósil, ajusta `burial` y `footprint` en el catálogo para que la profundidad y la huella de progreso coincidan con tu modelo (la superficie del hueso se asume en `topY = -burial`).

`public/models/README.md` describe el único GLB permitido en el sitio (`fossil_skull.glb`) y cómo validarlo con `npm run validate:models`.

## Ajustes rápidos

- `constants.ts` → `TERRAIN_SEG_X/Z`, `MAX_DEPTH`, `REVEAL_THRESHOLD` y `TOOL_SETTINGS`.
- `useExcavation.ts` → `createSpecimen()` controla posición, giro y escala aleatorios.
- `textures.ts` → `size`, octavas de `fbm()` y `repeat` de cada mapa.
