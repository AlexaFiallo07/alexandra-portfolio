'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Project } from '@/types';
import CategoryBadge from '@/components/ui/CategoryBadge';
import ChibiDancer from '@/components/dino/ChibiDancer';
import { cn } from '@/lib/utils';

interface ProjectModalProps {
  /** Proyecto a mostrar; `null` cierra el modal. */
  project: Project | null;
  onClose: () => void;
}

const STATUS_LABEL: Record<Project['status'], string> = {
  destacado: 'Destacado',
  'en-excavacion': 'En excavación',
  fosilizado: 'Fosilizado',
};

/** Modal con ficha técnica estratigráfica del proyecto (arquitectura, stack, highlights). */
export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  // Bloqueo de scroll + cierre con Escape
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
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[70] flex items-end justify-center bg-meso-night/85 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-meso-amber/30 shadow-amber-lg sm:rounded-3xl"
          >
            {/* Barra de escáner superior */}
            <div
              aria-hidden
              className="sticky top-0 z-10 h-0.5 bg-gradient-to-r from-meso-amber/0 via-meso-amber to-meso-amber/0"
            />

            <div className="p-6 sm:p-9">
              {/* Encabezado */}
              <div className="flex flex-wrap items-center gap-3">
                <CategoryBadge category={project.category} />
                <span
                  className={cn(
                    'font-mono text-[11px] uppercase tracking-[0.18em]',
                    project.status === 'destacado'
                      ? 'text-meso-amber'
                      : project.status === 'en-excavacion'
                        ? 'text-[#6FCF97]'
                        : 'text-meso-mist',
                  )}
                >
                  {STATUS_LABEL[project.status]}
                </span>
                <span className="ml-auto font-mono text-[11px] tracking-[0.18em] text-meso-mist">
                  {project.year}
                </span>
              </div>

              <h2
                id="project-modal-title"
                className="mt-4 font-display text-3xl font-semibold sm:text-4xl"
              >
                {project.title}
              </h2>
              <p className="mt-1.5 text-meso-amber">{project.subtitle}</p>
              <p className="mt-4 leading-relaxed text-meso-limestone/80">{project.description}</p>

              {/* Highlights */}
              {project.highlights.length > 0 && (
                <div className="mt-7">
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-meso-mist">
                    Hallazgos clave
                  </h3>
                  <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {project.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5 text-sm text-meso-limestone/85">
                        <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-meso-amber" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Arquitectura estratigráfica */}
              {project.architecture && project.architecture.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-meso-mist">
                    Arquitectura del sistema
                  </h3>
                  <ol className="relative mt-4 space-y-5 border-l border-meso-rock pl-5">
                    {project.architecture.map((layer, i) => (
                      <li key={layer.layer} className="relative">
                        <span
                          aria-hidden
                          className="absolute -left-[27px] top-1 grid h-4 w-4 place-items-center rounded-full border border-meso-amber/60 bg-meso-night"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-meso-amber" />
                        </span>
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-meso-amber">
                          {String(i + 1).padStart(2, '0')} · {layer.layer}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-meso-limestone/80">
                          {layer.detail}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Stack */}
              <div className="mt-8">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-meso-mist">
                  Estrato tecnológico
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-meso-rock bg-meso-night/70 px-3 py-1 font-mono text-[11px] tracking-wide text-meso-limestone/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Enlaces + cierre */}
              <div className="mt-9 flex flex-wrap items-center gap-3 border-t border-meso-rock/70 pt-6">
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/rep relative rounded-full bg-meso-amber px-5 py-2.5 text-sm font-semibold text-meso-night transition-colors hover:bg-meso-ember"
                  >
                    <span className="absolute -top-10 right-0 opacity-0 transition-opacity duration-200 group-hover/rep:opacity-100">
                      <ChibiDancer dancing className="h-9 w-9" />
                    </span>
                    Código en GitHub
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/live relative rounded-full border border-meso-rock px-5 py-2.5 text-sm text-meso-limestone transition-colors hover:border-meso-moss/60 hover:text-meso-moss"
                  >
                    <span className="absolute -top-10 right-0 opacity-0 transition-opacity duration-200 group-hover/live:opacity-100">
                      <ChibiDancer dancing className="h-9 w-9" />
                    </span>
                    Ver demo en vivo
                  </a>
                )}
                <button
                  onClick={onClose}
                  autoFocus
                  className="ml-auto rounded-full border border-meso-rock px-5 py-2.5 text-sm text-meso-mist transition-colors hover:border-meso-amber/60 hover:text-meso-amber"
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
