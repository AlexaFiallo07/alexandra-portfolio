# 🦕 Alexandra Fiallo — El Multiverso Jurásico del Código

Portafolio web interactivo con estética luminosa de **Estudio de Diseño / Brutalismo Suave Moderno** (`#F4F4F7`, `#FFFFFF`, `#E8E8EE`, bordes `#D8D8E2`, morado `#5B21B6` / `#7C3AED` y verde `#10B981` / `#059669`), construido con **Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion y React Three Fiber**.

> **Diseño + 3D conviven:** la paleta clara es la definitiva; las escenas 3D usan esos mismos colores (verde esmeralda, gafas moradas, vitrina clara). Si editas con Antigravity, conserva los tokens `studio-*` y los componentes de `src/components/3d/`.

## El Elenco Multi-Estilo

| Sección | Estilo | Dinosaurio / Elemento |
| --- | --- | --- |
| 🕶️ Hero | 3D (R3F) + SVG de respaldo | T-Rex 3D con gafas moradas que sigue el cursor y ruge al clic; ventanas flotantes en parallax |
| 🦖 Navegación / Scroll | Pixel Art (Chrome Dino) | Velociraptor verde y morado corriendo sobre línea punteada y saltando cactus y `<div>` |
| ☕ Sobre mí | 3D (R3F) + Caricatura 2D | Brachiosaurus tomando café `</>` + terópodo 3D que corre al entrar en pantalla y salta al clic |
| 🦴 Tech Stack | Fósil / Blueprint | Fósiles y huellas en línea fina morada y verde que se dibujan e iluminan al hover |
| 💻 Proyectos | Esquinas + Chibi | Stegosaurus con audífonos, dinos distintos en cada esquina y chibi bailarín en botones |
| 🌿 Ambiente | Siluetas + Partículas | Pterodáctilos minimalistas + hojas y partículas geométricas moradas y verdes |
| ☄️ Footer | Estudio / Chibi | Meteorito divertido + dinosaurio despidiéndose con la patita |

## Inicio rápido

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción
npm start
```

## Notas de integración 3D

- `src/components/dino/HeroTRexStudio.tsx` decide en runtime si hay WebGL: usa el T-Rex 3D y, si no, cae al SVG ilustrado.
- `src/components/sections/AboutSection.tsx` monta el vivarium 3D solo cuando entra en pantalla (`useInView`).
- Las escenas 3D se cargan con `next/dynamic` + `ssr: false` y muestran `CanvasLoader` (paleta `studio-*`).
- Todo el movimiento usa `transform`/`opacity` y respeta `prefers-reduced-motion`.

## Integración de modelos GLB (Blender → Three.js)

Los tres puntos 3D ya tienen `.glb` funcionales incluidos (generados por código); también aceptan esculturas `.glb` de Blender con los mismos nombres sin romper el diseño claro:

| Escena | Archivo | Clips | Respaldo |
| --- | --- | --- | --- |
| Hero | `public/models/trex_hero.glb` | `Idle`, `Roar` | Bust procedural con gafas |
| Sobre mí | `public/models/theropod_run.glb` | `Idle`, `Run`, `Jump` | Terópodo procedural animado |
| Tech Stack | `public/models/fossil_skull.glb` | `Idle` (opcional) | Cráneo fósil procedural |

- `useGLTF` + `useAnimations` cargan y reproducen los clips; `<Environment preset="studio" />` y canvas `alpha: true` se activan solo en la rama GLB.
- `/api/models/status?file=...` comprueba de forma segura qué archivos existen. Si no hay GLB o falla la carga, `ModelGate` monta el respaldo procedural automáticamente.
- Convención de exportación: `glTF Binary`, `+Y Up`, modifiers aplicados, skinning/shape keys incluidos, +X al frente, 30k–50k triángulos. Detalles y nombres de objetos en `public/models/README.md`.
- Regeneración y comprobación: `npm run generate:models` y `npm run validate:models`. Los GLB incluidos son versiones ligeras con animaciones reales; una escultura de Blender puede reemplazarlos sin cambios de código.
