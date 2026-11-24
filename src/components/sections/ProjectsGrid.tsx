'use client';

import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { motion } from 'framer-motion';
import { FEATURED_PROJECT, PROJECTS } from '@/data/projectsData';
import AmberCard from '@/components/ui/AmberCard';
import EraBadge from '@/components/ui/EraBadge';
import ProjectModal from '@/components/ui/ProjectModal';
import type { Project } from '@/types';

const EASE = [0.22, 1, 0.36, 1] as const;

const STATUS_META: Record<Project['status'], { label: string; className: string }> = {
  destacado: { label: 'Destacado', className: 'border-meso-amber/60 bg-meso-amber/10 text-meso-amber' },
  'en-excavacion': {
    label: 'En excavación',
    className: 'border-meso-moss/70 bg-meso-moss/15 text-[#22774F]',
  },
  fosilizado: { label: 'Fosilizado', className: 'border-meso-rock bg-meso-night text-meso-mist' },
};

/* ------------------------------------------------------------------ */
/*  Escáner hologrático 3D del proyecto destacado                      */
/* ------------------------------------------------------------------ */

const CUBE_FACES = [
  { text: 'EFFI', cls: '[transform:translateZ(58px)]' },
  { text: 'ADMI', cls: '[transform:rotateY(180deg)_translateZ(58px)]' },
  { text: 'IA', cls: '[transform:rotateY(90deg)_translateZ(58px)]' },
  { text: '2025', cls: '[transform:rotateY(-90deg)_translateZ(58px)]' },
  { text: 'STOCK', cls: '[transform:rotateX(90deg)_translateZ(58px)]' },
  { text: 'TIEMPO REAL', cls: '[transform:rotateX(-90deg)_translateZ(58px)]' },
];

function HologramScanner() {
  return (
    <div className="relative flex h-full min-h-[300px] w-full items-center justify-center overflow-hidden rounded-2xl border border-meso-amber/30 bg-[radial-gradient(ellipse_at_center,rgba(102,87,226,0.10),rgba(255,255,255,0.92)_72%)]">
      {/* Suelo de rejilla en perspectiva */}
      <div
        aria-hidden
        className="holo-floor absolute inset-x-[-50%] bottom-[-38%] h-[70%] opacity-70 [-webkit-mask-image:linear-gradient(to_top,black,transparent)] [mask-image:linear-gradient(to_top,black,transparent)] [transform:perspective(320px)_rotateX(58deg)]"
      />

      {/* Anillos orbitales */}
      <span
        aria-hidden
        className="absolute h-44 w-44 animate-spin rounded-full border border-dashed border-meso-amber/45"
        style={{ animationDuration: '9s' }}
      />
      <span
        aria-hidden
        className="absolute h-56 w-56 animate-spin rounded-full border border-meso-amber/20"
        style={{ animationDuration: '14s', animationDirection: 'reverse' }}
      />

      {/* Cubo de datos holográfico */}
      <div className="relative h-[116px] w-[116px] [perspective:600px]">
        <div className="holo-cube relative h-full w-full">
          {CUBE_FACES.map((face) => (
            <span
              key={face.text}
              className={`absolute inset-0 grid place-items-center border border-meso-amber/60 bg-meso-amber/[0.07] font-mono text-[10px] tracking-[0.2em] text-meso-amber backdrop-blur-[2px] ${face.cls}`}
            >
              {face.text}
            </span>
          ))}
        </div>
      </div>

      {/* Línea de escaneo */}
      <span
        aria-hidden
        className="animate-scan-line absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent via-meso-amber/25 to-transparent"
      />

      {/* Marcas HUD */}
      {[
        'left-3 top-3 border-l border-t',
        'right-3 top-3 border-r border-t',
        'left-3 bottom-3 border-b border-l',
        'right-3 bottom-3 border-b border-r',
      ].map((pos) => (
        <span key={pos} aria-hidden className={`absolute h-5 w-5 border-meso-amber/70 ${pos}`} />
      ))}

      {/* Etiquetas de datos */}
      <span className="absolute left-5 top-14 font-mono text-[9px] tracking-[0.16em] text-meso-amber/80">
        SKU-1042
      </span>
      <span className="absolute bottom-14 right-5 font-mono text-[9px] tracking-[0.16em] text-[#22774F]/90">
        SYNC ● LIVE
      </span>

      {/* Leyenda */}
      <p className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.24em] text-meso-mist">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-meso-amber" />
        Escáner holográfico · Activo
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Grid de proyectos (excavación)                                     */
/* ------------------------------------------------------------------ */

export default function ProjectsGrid() {
  const [active, setActive] = useState<Project | null>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const secondary = PROJECTS.slice(1);

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const rect = featuredRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -py * 6, y: px * 8 });
  };

  return (
    <section id="proyectos" className="relative py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/4 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(102,87,226,0.10),transparent_65%)] blur-2xl"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex items-center gap-4"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-meso-amber">
            03 — Excavación de proyectos
          </span>
          <span aria-hidden className="h-px flex-1 bg-meso-rock" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
          className="mt-6 max-w-2xl"
        >
          <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.75rem]">
            Estratos de <span className="text-amber-gradient">trabajo</span>
          </h2>
          <p className="mt-4 text-meso-mist">
            Cada proyecto es un hallazgo: abre la ficha técnica para estudiar su
            arquitectura capa por capa.
          </p>
        </motion.div>

        {/* ---------- Proyecto destacado ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mt-12"
        >
          {/* Capa de tilt (separada de la animación de entrada de Framer) */}
          <div
            ref={featuredRef}
            onPointerMove={onPointerMove}
            onPointerLeave={() => setTilt({ x: 0, y: 0 })}
            style={{
              perspective: 1200,
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
          <AmberCard className="p-0">
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:gap-10 lg:p-10">
              {/* Contenido */}
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-3">
                  <EraBadge era={FEATURED_PROJECT.era} />
                  <span className="rounded-full border border-meso-amber/60 bg-meso-amber/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-meso-amber">
                    Proyecto de grado
                  </span>
                  <span className="ml-auto font-mono text-[11px] tracking-[0.18em] text-meso-mist">
                    {FEATURED_PROJECT.year}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-4xl font-semibold sm:text-5xl">
                  {FEATURED_PROJECT.title}
                </h3>
                <p className="mt-2 text-meso-amber">{FEATURED_PROJECT.subtitle}</p>
                <p className="mt-4 leading-relaxed text-meso-limestone/80">
                  {FEATURED_PROJECT.description}
                </p>

                {/* Hallazgos */}
                <ul className="mt-6 space-y-2.5">
                  {FEATURED_PROJECT.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-sm text-meso-limestone/85">
                      <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-meso-amber" />
                      {h}
                    </li>
                  ))}
                </ul>

                {/* Stack */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {FEATURED_PROJECT.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-meso-rock bg-meso-night/70 px-3 py-1 font-mono text-[11px] text-meso-limestone/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setActive(FEATURED_PROJECT)}
                  className="mt-8 inline-flex items-center justify-center gap-2 self-start rounded-full bg-meso-amber px-7 py-3.5 text-sm font-semibold text-meso-night shadow-amber transition-all hover:-translate-y-0.5 hover:bg-meso-ember hover:shadow-amber-lg lg:mt-auto"
                >
                  Abrir ficha técnica
                  <span aria-hidden>→</span>
                </button>
              </div>

              {/* Escáner holográfico */}
              <div className="flex items-center">
                <HologramScanner />
              </div>
            </div>
          </AmberCard>
          </div>
        </motion.div>

        {/* ---------- Proyectos secundarios ---------- */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {secondary.map((project, i) => {
            const status = STATUS_META[project.status];
            return (
              <motion.button
                key={project.id}
                type="button"
                onClick={() => setActive(project)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.65, delay: i * 0.1, ease: EASE }}
                className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-meso-amber/70"
                aria-label={`Ver ficha de ${project.title}`}
              >
                <AmberCard className="flex h-full flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <span
                      aria-hidden
                      className="grid h-12 w-12 place-items-center rounded-xl border border-meso-rock bg-meso-night/70 text-2xl transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
                    >
                      {project.emoji ?? '🦴'}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <EraBadge era={project.era} />
                    <span className="font-mono text-[10px] tracking-[0.16em] text-meso-mist">
                      {project.year}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-xl font-semibold transition-colors group-hover:text-meso-amber">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-sm text-meso-amber/90">{project.subtitle}</p>
                  <p className="mt-3 flex-1 text-[13px] leading-relaxed text-meso-mist">
                    {project.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {project.stack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="rounded border border-meso-rock px-2 py-0.5 font-mono text-[10px] text-meso-limestone/70"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.stack.length > 3 && (
                      <span className="font-mono text-[10px] text-meso-mist/70">
                        +{project.stack.length - 3}
                      </span>
                    )}
                  </div>

                  <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-meso-mist transition-colors group-hover:text-meso-amber">
                    Ver ficha
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </AmberCard>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Modal de ficha técnica */}
      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
