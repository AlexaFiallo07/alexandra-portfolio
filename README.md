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
