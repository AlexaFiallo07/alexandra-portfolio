# 🦕 Alexandra Fiallo — Portafolio Mesozoico 3D

Portafolio web personal inmersivo y responsivo con estética **Fósil Minimalista / Editorial** y
acentos de **Ámbar Bioluminiscente**, construido con **Next.js (App Router), TypeScript,
Tailwind CSS, Framer Motion y React Three Fiber**.

## Temática

El stack profesional de Alexandra está organizado en tres **eras geológicas**:

| Era | Rango | Contenido |
| --- | --- | --- |
| 🔶 Triásico | 252 – 201 Ma | Core & Backend (Python, TS, Node, Django, NestJS, BD, Docker) |
| 🌿 Jurásico | 201 – 145 Ma | Frontend & Web dinámica (React, Next.js, Tailwind, Framer Motion) |
| 🟡 Cretácico | 145 – 66 Ma | Móvil, 3D & Game Dev (Flutter, Three.js, WebGL, videojuegos) |

## Secciones

- **Hero** — Cráneo fósil 3D procedural rotatorio 360° que sigue el cursor (escena de museo).
- **Sobre mí** — Biografía + dino bebé **low-poly** reactivo (parpadea, sigue el cursor y reacciona al scroll).
- **Eras & Skills** — Timeline de las tres eras con barras de excavación animadas y **badge vóxel/pixel-art** en la era Cretácica.
- **Excavación de proyectos** — EffiAdmi destacado con **escáner holográfico 3D** y modal de ficha técnica con arquitectura del sistema.
- **Contacto** — Formulario mesozoico con endpoint propio (`POST /api/contact`).

## Inicio rápido

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción
npm start
```

## Variables de entorno (opcional)

Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

- `RESEND_API_KEY` — si existe, el formulario envía correo vía [Resend](https://resend.com).
- Sin clave, el endpoint valida el payload y lo registra en consola (modo desarrollo).
- `CONTACT_TO_EMAIL` — destino del correo (por defecto el de Alexandra).

## Estructura

```text
src/
├── app/
│   ├── layout.tsx            # Root Layout (fuentes, SEO, JSON-LD)
│   ├── page.tsx              # Single Page App
│   ├── globals.css           # Variables + estilos base
│   └── api/contact/route.ts  # Endpoint de contacto
├── components/
│   ├── 3d/                   # CanvasLoader, FossilHeroScene, DinoPet3D
│   ├── sections/             # Hero, About, ErasSkills, ProjectsGrid, Contact
│   ├── ui/                   # AmberCard, ProjectModal, EraBadge
│   └── layout/               # Navbar, Footer
├── data/                     # skillsData.ts, projectsData.ts
├── lib/utils.ts              # cn() = clsx + tailwind-merge
└── types/                    # Interfaces de Project y Skill
```

## Notas técnicas

- Los modelos 3D son **procedurales** (primitivas de Three.js): no requieren archivos `.glb`.
  Si quieres añadir modelos propios, colócalos en `public/models/` y cárgalos con `useGLTF`.
- Las escenas 3D se importan con `next/dynamic` + `ssr: false` y muestran `CanvasLoader` mientras cargan.
- Hay detección de soporte **WebGL** con fallback a un emoji animado.
- Respeta `prefers-reduced-motion`.

## Contacto

- **GitHub:** https://github.com/alexandrafiallo
- **Correo:** `alexandra.fiallo@example.com` *(sustitúyelo por tu correo real en `Footer.tsx`,
  `ContactSection.tsx` y `api/contact/route.ts`)*
