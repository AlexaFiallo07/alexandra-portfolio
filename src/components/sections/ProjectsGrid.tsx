'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FEATURED_PROJECT, PROJECTS } from '@/data/projectsData';
import AmberCard from '@/components/ui/AmberCard';
import CategoryBadge from '@/components/ui/CategoryBadge';
import ProjectModal from '@/components/ui/ProjectModal';
import StegoProgrammer from '@/components/dino/StegoProgrammer';
import ChibiDancer from '@/components/dino/ChibiDancer';
import ProjectCornerDino, { type ProjectDinoVariant } from '@/components/dino/ProjectCornerDinos';
import type { Project } from '@/types';

const StegoProgrammer3D = dynamic(
  () => import('@/components/dino/StegoProgrammer3D'),
  {
    ssr: false,
    loading: () => <StegoProgrammer className="w-full" />,
  },
);

const EASE = [0.22, 1, 0.36, 1] as const;

const STATUS_META: Record<Project['status'], { label: string; className: string }> = {
  destacado: {
    label: 'Destacado',
    className: 'border-studio-purple/30 bg-studio-purple/10 text-studio-purple-deep',
  },
  'en-excavacion': {
    label: 'En desarrollo',
    className: 'border-studio-green/35 bg-studio-green/15 text-studio-green-deep',
  },
  fosilizado: {
    label: 'Completado',
    className: 'border-studio-border bg-studio-pearl text-studio-slate',
  },
};

const CORNER_VARIANTS: Record<string, ProjectDinoVariant> = {
  portafolio: 'sign-code',
  'tienda-virtual': 'headphones',
  'api-rest': 'sign-api',
};

function StegoPanel() {
  return (
    <div className="studio-grid relative flex h-full min-h-[290px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-studio-border bg-studio-pearl/70 p-4">
      <div className="relative h-56 w-full max-w-[340px]">
        <StegoProgrammer3D />
      </div>
      <p className="mt-2 flex items-center gap-2 rounded-full border border-studio-border bg-studio-card px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-studio-purple-deep shadow-sm">
        <span className="h-2 w-2 animate-pulse rounded-full bg-studio-green" />
        Stego compilando en vivo
      </p>
    </div>
  );
}

/**
 * Proyectos destacados: EFFIADMI abre la sección con su arquitectura real y
 * el resto de fichas quedan claramente agrupadas. Los dinosaurios pequeños
 * son solo un acento en las esquinas de las tarjetas.
 */
export default function ProjectsGrid() {
  const [active, setActive] = useState<Project | null>(null);
  const secondary = PROJECTS.slice(1);

  return (
    <section id="proyectos" className="relative scroll-mt-24 py-14 sm:py-28">
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: EASE }}
          className="flex items-center gap-4"
        >
          <span className="rounded-full border border-studio-purple/30 bg-studio-purple/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-studio-purple-deep">
            03 — Proyectos Destacados
          </span>
          <span aria-hidden className="h-px flex-1 bg-studio-border" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, delay: 0.06, ease: EASE }}
          className="mt-6 max-w-2xl"
        >
          <h2 className="font-display text-3xl font-bold leading-tight text-studio-ink sm:text-4xl lg:text-[2.6rem]">
            Proyectos con <span className="text-studio-gradient">arquitectura real</span>
          </h2>
          <p className="mt-3 text-base text-studio-slate">
            Abre cualquier ficha para ver el stack y la arquitectura por capas. También hay espacios
            limpios para futuros desarrollos empresariales y prototipos de videojuegos;
            las plantillas esperan contenido real.
          </p>
        </motion.div>

        {/* ---------- Proyecto destacado (EffiAdmi + Stegosaurus programador) ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-90px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-8 sm:mt-12"
        >
          <AmberCard className="p-0">
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.15fr_1fr] lg:gap-10 lg:p-10">
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2.5">
                  <CategoryBadge category={FEATURED_PROJECT.category} />
                  <span className="rounded-full border border-studio-green/35 bg-studio-green/15 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-studio-green-deep">
                    Proyecto de grado
                  </span>
                  <span className="ml-auto font-mono text-[11px] font-semibold tracking-[0.18em] text-studio-slate">
                    {FEATURED_PROJECT.year}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-4xl font-bold text-studio-ink sm:text-5xl">
                  {FEATURED_PROJECT.title}
                </h3>
                <p className="mt-2 font-semibold text-studio-purple">{FEATURED_PROJECT.subtitle}</p>
                <p className="mt-4 leading-relaxed text-studio-slate">
                  {FEATURED_PROJECT.description}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {FEATURED_PROJECT.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-sm text-studio-ink">
                      <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rotate-45 rounded-[2px] bg-studio-green" />
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-2">
                  {FEATURED_PROJECT.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-studio-border bg-studio-bg px-3 py-1 font-mono text-[11px] font-medium text-studio-ink"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Botones con Chibi bailarín al hacer hover */}
                <div className="mt-8 flex flex-wrap items-center gap-3 pt-4 lg:mt-auto">
                  <button
                    type="button"
                    onClick={() => setActive(FEATURED_PROJECT)}
                    className="group/demo relative inline-flex items-center justify-center gap-2 rounded-full border-2 border-studio-purple-deep bg-studio-purple px-7 py-3 text-sm font-semibold text-white shadow-brutal transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-studio-purple-deep"
                  >
                    <span className="pointer-events-none absolute -top-10 right-2 opacity-0 transition-opacity duration-200 group-hover/demo:opacity-100">
                      <ChibiDancer dancing className="h-9 w-9" />
                    </span>
                    Ver Demo / Ficha
                    <span aria-hidden>→</span>
                  </button>

                  {FEATURED_PROJECT.repoUrl && (
                    <a
                      href={FEATURED_PROJECT.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/gh relative inline-flex items-center gap-2 rounded-full border border-studio-border bg-studio-card px-6 py-3 text-sm font-semibold text-studio-ink shadow-studio transition-all hover:-translate-y-0.5 hover:border-studio-green hover:text-studio-green-deep"
                    >
                      <span className="pointer-events-none absolute -top-10 right-2 opacity-0 transition-opacity duration-200 group-hover/gh:opacity-100">
                        <ChibiDancer dancing className="h-9 w-9" />
                      </span>
                      Código en GitHub
                      <span aria-hidden>↗</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <StegoPanel />
              </div>
            </div>
          </AmberCard>
        </motion.div>

        {/* ---------- Próximamente / En desarrollo ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: EASE }}
          className="mt-8 flex items-center gap-4 sm:mt-12"
        >
          <span className="rounded-full border border-studio-green/35 bg-studio-green/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-studio-green-deep">
            Próximamente / En desarrollo
          </span>
          <span aria-hidden className="h-px flex-1 bg-studio-border" />
        </motion.div>

        {/* ---------- Proyectos secundarios (cada tarjeta con su dino distinto en la esquina) ---------- */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {secondary.map((project, i) => {
            const status = STATUS_META[project.status];
            const cornerVariant = CORNER_VARIANTS[project.id] ?? 'sign-code';
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                className="group flex"
              >
                <AmberCard className="relative flex h-full w-full flex-col p-6">
                  {/* Pequeño dinosaurio distinto en la esquina superior derecha */}
                  <div className="absolute right-3 top-3 z-10 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
                    <ProjectCornerDino variant={cornerVariant} className="h-14 w-14 sm:h-16 sm:w-16" />
                  </div>

                  <button
                    type="button"
                    onClick={() => setActive(project)}
                    className="flex flex-1 flex-col text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-studio-purple"
                    aria-label={`Ver ficha de ${project.title}`}
                  >
                    <div className="flex flex-wrap items-center gap-2 pr-14 sm:pr-16">
                      <span
                        className={`rounded-full border px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] ${status.className}`}
                      >
                        {status.label}
                      </span>
                      <span className="hidden font-mono text-[10px] font-medium text-studio-slate min-[360px]:inline">
                        {project.year}
                      </span>
                      {project.isPlaceholder && (
                        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-studio-gold">
                          Plantilla
                        </span>
                      )}
                    </div>

                    <div className="mt-4">
                      <CategoryBadge category={project.category} />
                    </div>

                    <h3 className="mt-4 font-display text-xl font-bold text-studio-ink transition-colors group-hover:text-studio-purple-deep">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-studio-purple">{project.subtitle}</p>
                    <p className="mt-3 flex-1 text-[13px] leading-relaxed text-studio-slate">
                      {project.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {project.stack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-studio-border bg-studio-bg px-2 py-0.5 font-mono text-[10px] font-medium text-studio-ink"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.stack.length > 3 && (
                        <span className="font-mono text-[10px] text-studio-slate">
                          +{project.stack.length - 3}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Botones de acción con chibi bailarín al hover */}
                  <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-studio-border pt-4">
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/demo relative inline-flex items-center gap-1.5 rounded-full bg-studio-purple px-4 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-studio-purple-deep"
                      >
                        <ChibiDancer
                          dancing
                          className="h-5 w-5 opacity-0 transition-opacity duration-200 group-hover/demo:opacity-100"
                        />
                        Ver Demo ↗
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActive(project)}
                        className="group/demo relative inline-flex items-center gap-1.5 rounded-full bg-studio-purple/10 px-4 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-studio-purple-deep transition-colors hover:bg-studio-purple hover:text-white"
                      >
                        <ChibiDancer
                          dancing
                          className="h-5 w-5 opacity-0 transition-opacity duration-200 group-hover/demo:opacity-100"
                        />
                        Ver Demo →
                      </button>
                    )}

                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/gh relative inline-flex items-center gap-1.5 rounded-full border border-studio-border bg-studio-bg px-3.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-studio-ink transition-colors hover:border-studio-green hover:text-studio-green-deep"
                      >
                        <ChibiDancer
                          dancing
                          className="h-5 w-5 opacity-0 transition-opacity duration-200 group-hover/gh:opacity-100"
                        />
                        GitHub ↗
                      </a>
                    )}
                  </div>
                </AmberCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
