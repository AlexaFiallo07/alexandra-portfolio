'use client';

import { motion } from 'framer-motion';
import { STACK } from '@/data/skillsData';
import FossilIcon from '@/components/dino/FossilIcons';
import { pct } from '@/lib/utils';
import type { SkillGroup } from '@/types';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Ficha de habilidad con icono fósil que se "dibuja" al hacer hover. */
function SkillBadge({ skill, accent, index }: { skill: SkillGroup['skills'][number]; accent: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: 0.05 * index, ease: EASE }}
      className="fossil-badge group/sk rounded-xl border border-meso-rock/70 bg-meso-night/40 p-4 focus-within:border-meso-moss/60"
      tabIndex={0}
    >
      <div className="flex items-start gap-3">
        {/* Icono fósil line-art (brilla y se ensambla al hover) */}
        <span
          className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-meso-moss/35 bg-meso-moss/[0.07] text-meso-moss transition-colors group-hover/sk:text-[#E4C77E]"
          style={{ borderColor: `${accent}55` }}
        >
          <FossilIcon kind={skill.fossil} className="h-7 w-7" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="truncate text-sm font-medium text-meso-limestone">{skill.name}</span>
            <span className="font-mono text-[10px] text-meso-moss">{pct(skill.level)}</span>
          </div>
          {skill.hint && (
            <p className="mt-0.5 truncate text-[12px] text-meso-mist/80">{skill.hint}</p>
          )}
        </div>
      </div>

      {/* Barra de dominio */}
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-meso-rock/60">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1, delay: 0.1 + index * 0.05, ease: EASE }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${accent}88, ${accent})`,
            boxShadow: `0 0 10px ${accent}66`,
          }}
        />
      </div>
    </motion.div>
  );
}

/**
 * Sección de habilidades: categorías del stack (Backend, Frontend, Móvil,
 * Bases de Datos, DevOps) con iconos de fósil line-art que se ensamblan
 * y brillan al pasar el cursor.
 */
export default function StackSection() {
  return (
    <section id="stack" className="relative py-24 sm:py-32">
      {/* Resplandor de fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[480px] w-[720px] max-w-full -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(196,163,90,0.10),transparent_70%)] blur-2xl"
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
            02 — Tech Stack
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
            Habilidades que se <span className="text-amber-gradient">ensamblan</span>
          </h2>
          <p className="mt-4 text-meso-mist">
            Cada tecnología es un fósil en mi caja de herramientas: pásale el cursor y
            verás cómo se dibuja. Niveles honestos, sin inflar.
          </p>
        </motion.div>

        {/* Categorías */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {STACK.map((group, gi) => (
            <motion.article
              key={group.id}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-90px' }}
              transition={{ duration: 0.7, delay: gi * 0.06, ease: EASE }}
              className="glass relative overflow-hidden rounded-2xl border border-meso-rock/80 p-5 shadow-card sm:p-6 lg:last:col-span-2"
            >
              {/* Brillo de acento de la categoría */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-25 blur-2xl"
                style={{ background: group.accent }}
              />

              <div className="relative flex items-start gap-4">
                <span
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border bg-meso-night/60"
                  style={{ borderColor: `${group.accent}66`, color: group.accent }}
                >
                  <FossilIcon kind={group.icon} className="h-9 w-9" />
                </span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em]" style={{ color: group.accent }}>
                    {group.subtitle}
                  </p>
                  <h3 className="mt-1 font-display text-2xl font-semibold">{group.label}</h3>
                </div>
                <span className="ml-auto font-mono text-[11px] text-meso-mist">
                  {group.skills.length} fósiles
                </span>
              </div>

              <p className="relative mt-4 text-sm leading-relaxed text-meso-mist">
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
