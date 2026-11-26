# Alexandra Fiallo — Full-Stack Developer

Portafolio de Alexandra Fiallo: **proyectos reales, API, bases de datos, apps web y móviles**. Construido con **Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion y React Three Fiber**.

Paleta: fondo `#F6F3FB`; morados `#1F1433`, `#3A2370`, `#6A4DAB`, `#A98FD6`; oro `#C4A35A`; detalles verdes. Los dinosaurios son **solo acentos creativos**, no el argumento del sitio.

## Estructura y acentos permitidos

| Sección | Contenido principal | Acento creativo conservado |
| --- | --- | --- |
| Hero | Presentación full-stack y CTAs | T-Rex con gafas, 3D (R3F) con respaldo SVG |
| Sobre mí | Perfil, backend, frontend y resultados | Ningún personaje adicional |
| Stack | Minijuego de excavación 3D y herramientas reales | Robot T-Rex 3D en la vitrina (el GLB que antes estaba en el hero) y fósiles/huellas en línea fina |
| Proyectos | EffiAdmi y fichas de proyectos | Stegosaurus programador 3D y dinosaurios pequeños en las esquinas de las tarjetas |
| Ambiente | Navegación y contacto | PixelRaptor pixel art que esquiva obstáculos al hacer scroll y pterodáctilos de fondo en un único Canvas 3D |

Por petición posterior se recuperaron dos piezas que se habían retirado: el **robot T-Rex** (ahora en la vitrina de Stack, no en el hero) y el **PixelRaptor del navbar** con sus cactus y etiquetas `<div>`. Siguen fuera el dinosaurio en vitrina, el que corre, el compañero robótico, el footer dino y cualquier geometría de corte robótica distinta del T-Rex. Tampoco se inventaron datos para **Tienda Virtual** ni **API REST**: sus fichas están marcadas como *Plantilla*.

## Inicio rápido

```bash
npm install
npm run dev          # http://localhost:3000/#proyectos
npm run build        # detener dev antes de compilar
npm start
npm run validate:models
```

## Encuadre automático de escenas 3D

El problema de figuras descentradas o cortadas venía de cámaras y `floorY` hardcodeados, de ignorar la esfera envolvente y de rigs que solo movían `camera.position.z`.

La solución está en:

- `src/lib/framing.ts` → `computeFraming()` calcula `THREE.Box3` (preciso) y `boundingSphere` de la figura, el centro real, la distancia según FOV/aspecto y los planos `near`/`far` según el zoom máximo.
- `src/components/3d/AutoFrameRig.tsx` → aplica el encuadre dentro del Canvas: centra la cámara (o el `target` de `OrbitControls` si existiera), interpola la distancia al hacer zoom y recalcula al redimensionar. El modo `sphere` garantiza que la figura quepa aunque gire 360°; el modo `box` encuadra con precisión escenas con cámara inclinada.
- Rig activo en `HeroTRex3D`, `StegoProgrammer3D`, `RobotTRexVitrina`, `PteroFlock3D` (solo `near`/`far`, sin mover la cámara) y `ExcavationScene`.
- `src/lib/cameraZoom.ts` limita el zoom entre `0.62` y `1.75`; `framing.ts` dimensiona `near`/`far` para que **todos** los niveles de zoom mantengan la figura completa.

Los contenedores con `overflow-hidden` (hero, panel del Stego, yacimiento, vitrina del fósil) no recortan la geometría: el Canvas encaja la figura con un margen del 10–16 % dentro de sus límites. `#proyectos` lleva `scroll-mt-24` y `section[id]` tiene `scroll-margin-top: 6.5rem` para que la navbar flotante no tape el ancla.

## Modelos 3D

Se mantienen dos GLB: `public/models/trex_hero.glb` (robot T-Rex esquelético de la vitrina, exportado desde Blender: 8,82 MB, 116 nodos, 114 mallas, clips `Idle`/`Roar` y pupilas `PupilL`/`PupilR`) y `public/models/fossil_skull.glb` (cráneo fósil, clip `Idle` opcional, usado por la vitrina procedural y como respaldo del minijuego). El resto de las figuras son procedurales (Three.js / SVG).

- `npm run generate:models` regenera solo el GLB del cráneo sin Blender.
- El robot T-Rex se regenera con `scripts/prepare-blendswap.py` y Blender 5.3 desde `assets/blendswap/Robot-T-Rex.blend` (archivo local ignorado por Git); el GLB resultante está incluido para que no dependas de Blender.
- `npm run validate:models` comprueba ambos archivos, jerarquía, escalas, clips y pupilas.
- `src/lib/modelFiles.ts` es la lista blanca de archivos permitidos.

## Movimiento e interacción

- `src/lib/dinoInteraction.ts` y `src/lib/dinoMotion.ts`: puntero, selección, arrastre y movimiento del T-Rex y del Stegosaurus.
- `src/lib/spin360.ts` y `src/components/dino/SpinOnPress.tsx`: giro 360° al pulsar.
- `ZoomControls.tsx`: botones `− / % / + / ↺` sobre el hero, el Stego y el fósil.
- Todo el movimiento respeta `prefers-reduced-motion` y usa `transform`/`opacity` cuando es 2D.

## Nota sobre assets externos retirados

Se descargaron modelos de BlendSwap para probar el diseño: Plesiosaurus #30922 (CC BY NC 4.0), Gallimimus #29407 (CC BY 4.0), Brachiosaurus #28516 (CC BY 4.0), Robot T-Rex #23140 (CC0), Robot-Dinosaur #2712 (CC0) y Parasaurolophus #29831 (CC BY 4.0). **Las licencias estaban declaradas por el uploader y no verificadas por BlendSwap**; la descarga costó 0 créditos dentro de la cuota gratuita. Del robot T-Rex se conservan `trex_hero.glb` en la vitrina de Stack, su `.blend` local y `scripts/prepare-blendswap.py`; el resto de `.blend`/`.glb` y sus scripts de conversión se eliminaron.
