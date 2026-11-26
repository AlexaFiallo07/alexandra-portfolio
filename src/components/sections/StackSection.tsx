'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, useInView } from 'framer-motion';
import { STACK } from '@/data/skillsData';
import FossilIcon from '@/components/dino/FossilIcons';
import CanvasLoader from '@/components/3d/CanvasLoader';
import ExcavationGame from '@/components/games/excavation/ExcavationGame';
import { cn, pct } from '@/lib/utils';
import type { SkillGroup } from '@/types';

const RobotTRexVitrina = dynamic(() => import('@/components/dino/RobotTRexVitrina'), {
  ssr: false,
  loading: () => <CanvasLoader label="Ensamblando al robot T-Rex…" />,
});

const EASE = [0.22, 1, 0.36, 1] as const;

/** Ficha de habilidad estilo blueprint con fósil line-art morado/verde que se ilumina al hover. */
function SkillBadge({
  skill,
  accent,
  index,
}: {
  skill: SkillGroup['skills'][number];
  accent: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: 0.04 * index, ease: EASE }}
      className="fossil-badge group/sk rounded-xl border border-studio-border bg-studio-bg/80 p-4 focus-within:border-studio-purple"
      tabIndex={0}
    >
      <div className="flex items-start gap-3">
        {/* Icono fósil / huella en línea fina morada y verde */}
        <span
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border bg-studio-card transition-colors"
          style={{ borderColor: `${accent}55`, color: accent }}
        >
          <FossilIcon kind={skill.fossil} className="h-7 w-7" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="truncate text-sm font-bold text-studio-ink">{skill.name}</span>
            <span
              className="rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold"
              style={{ backgroundColor: `${accent}18`, color: accent }}
            >
              {pct(skill.level)}
            </span>
          </div>
          {skill.hint && (
            <div className="mt-1.5 flex min-w-0 items-center gap-2">
              {skill.stage && (
                <span
                  className={cn(
                    'shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.1em]',
                    skill.stage === 'aplico'
                      ? 'border-studio-green/35 bg-studio-green/10 text-studio-green-deep'
                      : 'border-studio-gold/45 bg-studio-gold/15 text-studio-ink',
                  )}
                >
                  {skill.stage === 'aplico' ? 'Aplico' : 'En desarrollo'}
                </span>
              )}
              <span className="truncate text-[12px] text-studio-slate">{skill.hint}</span>
            </div>
          )}
        </div>
      </div>

      {/* Barra de progreso blueprint */}
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-studio-pearl">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.9, delay: 0.08 + index * 0.04, ease: EASE }}
          className="h-full rounded-full"
          style={{ backgroundColor: accent }}
        />
      </div>
    </motion.div>
  );
}

/**
 * Stack tecnológico: el minijuego de excavación como acento creativo y el
 * inventario real de herramientas que uso para construir productos full-stack.
 */
export default function StackSection() {
  const robotRef = useRef<HTMLDivElement>(null);
  const robotInView = useInView(robotRef, { once: true, margin: '-80px' });

  return (
    <section id="stack" className="relative py-20 sm:py-28">
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: EASE }}
          className="flex items-center gap-4"
        >
          <span className="rounded-full border border-studio-green/35 bg-studio-green/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-studio-green-deep">
            02 — Tech Stack
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
            Herramientas que uso y estoy{' '}
            <span className="text-studio-gradient">aprendiendo</span>
          </h2>
          <p className="mt-3 text-base text-studio-slate">
            Excava con el mouse para descubrir un fósil y revisa las categorías de siempre: Backend,
            Frontend, Móvil, Datos, DevOps y Videojuegos &amp; IA. Cada herramienta indica si ya la
            aplico o si está en desarrollo. Los esqueletos en línea fina son solo el detalle visual.
          </p>
        </motion.div>

        {/* ---------- Mini-juego: excavación de fósiles con el mouse ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        >
          <ExcavationGame />
        </motion.div>

        {/* ---------- Robot T-Rex: vuelve a la vitrina que ocupaba el cráneo ---------- */}
        <motion.div
          ref={robotRef}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.11, ease: EASE }}
          className="relative mt-6 grid overflow-hidden rounded-3xl border border-studio-border bg-studio-card shadow-studio lg:grid-cols-[1fr_360px]"
        >
          <div className="p-6 sm:p-8">
            <span className="rounded-full border border-studio-gold/45 bg-studio-gold/15 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-studio-ink">
              03 — Robot T-Rex
            </span>
            <h3 className="mt-4 font-display text-2xl font-bold text-studio-ink sm:text-3xl">
              El compañero mecánico
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-studio-slate">
              El robot T-Rex esquelético que antes presidía el hero vuelve aquí, en la vitrina que
              ocupaba el cráneo fósil. Usa el GLB real exportado desde Blender (8,82 MB, 114 mallas),
              con arrastre manual, rugido, pupilas reactivas, acabado metálico, encuadre automático y
              zoom seguro.
            </p>
            <p className="mt-4 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-studio-purple-deep">
              → Clic para girarlo 360° y rugir · usa el zoom sin recortarlo
            </p>
          </div>

          <div className="studio-grid relative h-80 border-t border-studio-border bg-studio-pearl/40 lg:border-l lg:border-t-0">
            {robotInView && <RobotTRexVitrina className="h-full w-full" />}
            <span className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-studio-border bg-studio-card/90 px-2.5 py-1 font-mono text-[10px] font-semibold text-studio-slate shadow-sm">
              trex_hero.glb · R3F
            </span>
          </div>
        </motion.div>

        {/* Categorías */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {STACK.map((group, gi) => (
            <motion.article
              key={group.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.65, delay: gi * 0.05, ease: EASE }}
              className="studio-grid relative overflow-hidden rounded-3xl border border-studio-border bg-studio-card p-5 shadow-studio sm:p-7"
            >
              <div className="relative flex items-start gap-4">
                <span
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border bg-studio-bg"
                  style={{ borderColor: `${group.accent}55`, color: group.accent }}
                >
                  <FossilIcon kind={group.icon} className="h-9 w-9" />
                </span>
                <div>
                  <p
                    className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em]"
                    style={{ color: group.accent }}
                  >
                    {group.subtitle}
                  </p>
                  <h3 className="mt-1 font-display text-2xl font-bold text-studio-ink">
                    {group.label}
                  </h3>
                </div>
                <span className="ml-auto rounded-full border border-studio-border bg-studio-pearl px-2.5 py-1 font-mono text-[10px] font-semibold text-studio-slate">
                  {group.skills.length} herramientas
                </span>
              </div>

              <p className="relative mt-4 text-sm leading-relaxed text-studio-slate">
                {group.description}
              </p>

              <div className="relative mt-5 grid gap-3 sm:grid-cols-2">
                {group.skills.map((skill, i) => (
                  <SkillBadge key={skill.name} skill={skill} accent={group.accent} index={i} />
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
