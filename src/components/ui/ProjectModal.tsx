'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Project } from '@/types';
import CategoryBadge from '@/components/ui/CategoryBadge';
import ChibiDancer from '@/components/dino/ChibiDancer';
import { cn } from '@/lib/utils';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const STATUS_LABEL: Record<Project['status'], string> = {
  destacado: 'Destacado',
  'en-excavacion': 'En desarrollo',
  fosilizado: 'Completado',
};

/** Modal luminoso con ficha técnica del proyecto (arquitectura, stack, highlights). */
export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[70] flex items-end justify-center bg-studio-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 36, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-studio-border bg-studio-card shadow-studio-lg sm:rounded-3xl"
          >
            {/* Acento superior morado → verde */}
            <div
              aria-hidden
              className="sticky top-0 z-10 h-1 bg-gradient-to-r from-studio-purple-deep via-studio-purple to-studio-green"
            />

            <div className="p-6 sm:p-9">
              {/* Encabezado */}
              <div className="flex flex-wrap items-center gap-3">
                <CategoryBadge category={project.category} />
                <span
                  className={cn(
                    'rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em]',
                    project.status === 'destacado'
                      ? 'bg-studio-purple/10 text-studio-purple-deep'
                      : project.status === 'en-excavacion'
                        ? 'bg-studio-green/15 text-studio-green-deep'
                        : 'bg-studio-pearl text-studio-slate',
                  )}
                >
                  {STATUS_LABEL[project.status]}
                </span>
                <span className="ml-auto font-mono text-[11px] font-medium tracking-[0.18em] text-studio-slate">
                  {project.year}
                </span>
              </div>

              <h2
                id="project-modal-title"
                className="mt-4 font-display text-3xl font-bold text-studio-ink sm:text-4xl"
              >
                {project.title}
              </h2>
              <p className="mt-1.5 font-medium text-studio-purple">{project.subtitle}</p>
              <p className="mt-4 leading-relaxed text-studio-slate">{project.description}</p>

              {/* Highlights */}
              {project.highlights.length > 0 && (
                <div className="mt-7">
                  <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-studio-purple-deep">
                    Puntos clave
                  </h3>
                  <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {project.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5 text-sm text-studio-ink">
                        <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rotate-45 rounded-[2px] bg-studio-green" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Arquitectura */}
              {project.architecture && project.architecture.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-studio-purple-deep">
                    Arquitectura del sistema
                  </h3>
                  <ol className="relative mt-4 space-y-5 border-l-2 border-studio-border pl-5">
                    {project.architecture.map((layer, i) => (
                      <li key={layer.layer} className="relative">
                        <span
                          aria-hidden
                          className="absolute -left-[29px] top-1 grid h-4 w-4 place-items-center rounded-full border-2 border-studio-purple bg-studio-card"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-studio-green" />
                        </span>
                        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-studio-purple-deep">
                          {String(i + 1).padStart(2, '0')} · {layer.layer}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-studio-slate">
                          {layer.detail}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Stack */}
              <div className="mt-8">
                <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-studio-purple-deep">
                  Stack tecnológico
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-studio-border bg-studio-bg px-3 py-1 font-mono text-[11px] font-medium text-studio-ink"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Enlaces + cierre */}
              <div className="mt-9 flex flex-wrap items-center gap-3 border-t border-studio-border pt-6">
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/rep relative inline-flex items-center gap-2 rounded-full bg-studio-purple px-5 py-2.5 text-sm font-semibold text-white shadow-studio transition-colors hover:bg-studio-purple-deep"
                  >
                    <span className="pointer-events-none absolute -top-10 right-2 opacity-0 transition-opacity duration-200 group-hover/rep:opacity-100">
                      <ChibiDancer dancing className="h-9 w-9" />
                    </span>
                    Código en GitHub ↗
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/live relative inline-flex items-center gap-2 rounded-full border border-studio-green bg-studio-green/10 px-5 py-2.5 text-sm font-semibold text-studio-green-deep transition-colors hover:bg-studio-green hover:text-white"
                  >
                    <span className="pointer-events-none absolute -top-10 right-2 opacity-0 transition-opacity duration-200 group-hover/live:opacity-100">
                      <ChibiDancer dancing className="h-9 w-9" />
                    </span>
                    Ver demo en vivo ↗
                  </a>
                )}
                <button
                  onClick={onClose}
                  autoFocus
                  className="ml-auto rounded-full border border-studio-border bg-studio-bg px-5 py-2.5 text-sm font-medium text-studio-ink transition-colors hover:border-studio-purple hover:text-studio-purple-deep"
                >
                  Cerrar ficha ✕
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
