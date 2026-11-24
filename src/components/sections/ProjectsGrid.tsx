'use client';

import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { motion } from 'framer-motion';
import { FEATURED_PROJECT, PROJECTS } from '@/data/projectsData';
import AmberCard from '@/components/ui/AmberCard';
import CategoryBadge from '@/components/ui/CategoryBadge';
import ProjectModal from '@/components/ui/ProjectModal';
import StegoProgrammer from '@/components/dino/StegoProgrammer';
import ChibiDancer from '@/components/dino/ChibiDancer';
import type { Project } from '@/types';

const EASE = [0.22, 1, 0.36, 1] as const;

const STATUS_META: Record<Project['status'], { label: string; className: string }> = {
  destacado: { label: 'Destacado', className: 'border-meso-amber/60 bg-meso-amber/10 text-meso-amber' },
  'en-excavacion': {
    label: 'En excavación',
    className: 'border-meso-moss/70 bg-meso-moss/15 text-[#6FCF97]',
  },
  fosilizado: { label: 'Fosilizado', className: 'border-meso-rock bg-meso-night text-meso-mist' },
};

/* ------------------------------------------------------------------ */
/*  Stegosaurus programador (proyecto destacado)                        */
/* ------------------------------------------------------------------ */

function StegoPanel() {
  return (
    <div className="relative flex h-full min-h-[300px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-meso-moss/30 bg-[radial-gradient(ellipse_at_center,rgba(196,163,90,0.10),rgba(31,20,51,0.85)_75%)] p-4">
      {/* Rejilla de fondo sutil */}
      <div
        aria-hidden
        className="holo-floor absolute inset-x-[-50%] bottom-[-38%] h-[60%] opacity-40 [-webkit-mask-image:linear-gradient(to_top,black,transparent)] [mask-image:linear-gradient(to_top,black,transparent)] [transform:perspective(320px)_rotateX(58deg)]"
      />

      <div className="relative w-full max-w-[320px]">
        <StegoProgrammer className="w-full" />
      </div>

      {/* Leyenda */}
      <p className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.24em] text-meso-mist">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-meso-moss" />
        Stego compilando · 60 fps
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
        className="pointer-events-none absolute right-0 top-1/4 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(106,77,171,0.12),transparent_65%)] blur-2xl"
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
                  <CategoryBadge category={FEATURED_PROJECT.category} />
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

                <div className="mt-8 flex flex-wrap items-center gap-3 lg:mt-auto">
                  <button
                    onClick={() => setActive(FEATURED_PROJECT)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-meso-amber px-7 py-3.5 text-sm font-semibold text-meso-night shadow-amber transition-all hover:-translate-y-0.5 hover:bg-meso-ember hover:shadow-amber-lg"
                  >
                    Abrir ficha técnica
                    <span aria-hidden>→</span>
                  </button>

                  {/* Chibi bailarín al hacer hover sobre el botón de código */}
                  {FEATURED_PROJECT.repoUrl && (
                    <a
                      href={FEATURED_PROJECT.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/gh relative inline-flex items-center gap-2 rounded-full border border-meso-rock px-6 py-3.5 text-sm text-meso-limestone transition-all hover:-translate-y-0.5 hover:border-meso-moss/60 hover:text-meso-moss"
                    >
                      <span className="absolute -top-9 right-0 opacity-0 transition-opacity duration-200 group-hover/gh:opacity-100">
                        <ChibiDancer dancing className="h-10 w-10 drop-shadow-[0_0_8px_rgba(111,207,151,0.5)]" />
                      </span>
                      Código en GitHub
                      <span aria-hidden>↗</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Stegosaurus programador */}
              <div className="flex items-center">
                <StegoPanel />
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
                    <CategoryBadge category={project.category} />
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

                  {/* Chibi que baila al pasar el cursor por la tarjeta */}
                  <span className="mt-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-meso-mist transition-colors group-hover:text-meso-amber">
                    <ChibiDancer
                      dancing
                      className="h-7 w-7 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    />
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
