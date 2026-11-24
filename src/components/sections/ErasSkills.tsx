'use client';

import { motion } from 'framer-motion';
import { ERAS } from '@/data/skillsData';
import EraBadge from '@/components/ui/EraBadge';
import { cn, pct } from '@/lib/utils';
import type { Era } from '@/types';

const EASE = [0.22, 1, 0.36, 1] as const;

const ERA_NUMBER: Record<Era, string> = {
  triassic: 'I',
  jurassic: 'II',
  cretaceous: 'III',
};

/* ------------------------------------------------------------------ */
/*  Pixel/Vóxel Dino — badge de game dev estilo 3D pixel art           */
/* ------------------------------------------------------------------ */

/** Sprite de 12×12: '1' = cuerpo, '2' = acento ámbar, '.' = vacío. */
const VOXEL_DINO = [
  '............',
  '...2.2.2....',
  '....1111....',
  '...11111111.',
  '...11211111.',
  '..111111111.',
  '...1111111..',
  '....1111....',
  '....11.11...',
  '...11..11...',
  '..11....11..',
  '............',
];

function VoxelDinoBadge() {
  const cells = VOXEL_DINO.flatMap((row, y) =>
    Array.from(row).map((code, x) => ({ code, x, y, key: `${x}-${y}` })),
  );

  return (
    <div className="group/vx">
      <div className="relative [perspective:700px]">
        <div className="grid w-fit origin-center grid-cols-12 gap-[2px] [transform-style:preserve-3d] transition-transform duration-500 ease-out group-hover/vx:[transform:rotateX(-20deg)_rotateY(26deg)]">
          {cells.map(({ code, key }) => (
            <span
              key={key}
              aria-hidden
              className={cn(
                'block h-2.5 w-2.5 rounded-[2px] transition-all duration-500',
                code === '.' && 'bg-transparent',
                code === '1' && 'bg-[#4E7A55] shadow-[inset_-1px_-1px_0_rgba(0,0,0,0.25)]',
                code === '2' &&
                  'bg-meso-amber shadow-[0_0_8px_rgba(102,87,226,0.6)] [transform:translateZ(7px)]',
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Timeline de eras geológicas con skills                             */
/* ------------------------------------------------------------------ */

export default function ErasSkills() {
  return (
    <section id="eras" className="relative py-24 sm:py-32">
      {/* Resplandor de fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[480px] w-[720px] max-w-full -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(46,139,98,0.12),transparent_70%)] blur-2xl"
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
            02 — Stack por eras
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
            Tres eras. <span className="text-amber-gradient">Un mismo fósil.</span>
          </h2>
          <p className="mt-4 text-meso-mist">
            Mi stack organizado estratigráficamente: de los cimientos del backend a la
            cumbre del 3D y los videojuegos.
          </p>
        </motion.div>

        {/* Línea estratigráfica + eras */}
        <div className="relative mt-14">
          {/* Línea vertical de estratos */}
          <span
            aria-hidden
            className="absolute bottom-4 left-[7px] top-4 hidden w-px bg-gradient-to-b from-[#9C6B3F] via-meso-moss to-meso-amber md:block"
          />

          <div className="space-y-14">
            {ERAS.map((group, eraIndex) => (
              <motion.article
                key={group.era}
                initial={{ opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7, ease: EASE }}
                className="relative md:pl-12"
              >
                {/* Punto estratigráfico en la línea */}
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 hidden h-4 w-4 place-items-center rounded-full border bg-meso-night md:grid"
                  style={{ borderColor: group.accent }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: group.accent }}
                  />
                </span>

                <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-10">
                  {/* Columna izquierda: identidad de la era */}
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <EraBadge era={group.era} />
                      <span
                        className="font-display text-2xl font-bold"
                        style={{ color: group.accent }}
                      >
                        {ERA_NUMBER[group.era]}
                      </span>
                    </div>
                    <p className="mt-3 font-mono text-[11px] tracking-[0.18em] text-meso-mist">
                      {group.range}
                    </p>
                    <h3 className="mt-1.5 font-display text-2xl font-semibold">
                      {group.label}
                    </h3>
                    <p
                      className="mt-1 text-sm font-medium"
                      style={{ color: group.accent }}
                    >
                      {group.subtitle}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-meso-mist">
                      {group.description}
                    </p>
                  </div>

                  {/* Columna derecha: skills con barras de excavación */}
                  <div className="glass rounded-2xl border border-meso-rock/80 p-5 shadow-card sm:p-6">
                    <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                      {group.skills.map((skill, i) => (
                        <div key={skill.name} className="group/skill">
                          <div className="flex items-baseline justify-between gap-3">
                            <span className="text-sm font-medium text-meso-limestone">
                              {skill.name}
                            </span>
                            <span className="font-mono text-[10px] text-meso-mist">
                              {pct(skill.level)}
                            </span>
                          </div>
                          {skill.hint && (
                            <p className="mt-0.5 truncate text-[12px] text-meso-mist/80">
                              {skill.hint}
                            </p>
                          )}
                          {/* Barra de excavación */}
                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-meso-rock/50 ring-1 ring-inset ring-meso-rock/70">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true, margin: '-60px' }}
                              transition={{
                                duration: 1,
                                delay: 0.15 + i * 0.06,
                                ease: EASE,
                              }}
                              className="h-full rounded-full"
                              style={{
                                background: `linear-gradient(90deg, ${group.accent}99, ${group.accent})`,
                                boxShadow: `0 0 10px ${group.accent}66`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Badge vóxel dentro de la era Cretácica (Game Dev) */}
                    {group.era === 'cretaceous' && (
                      <div className="mt-6 flex flex-col items-start gap-5 rounded-xl border border-dashed border-meso-amber/40 bg-meso-night/50 p-5 sm:flex-row sm:items-center">
                        <VoxelDinoBadge />
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-meso-amber">
                            Badge vóxel · Cretácico
                          </p>
                          <p className="mt-1.5 font-display text-[15px] font-semibold">
                            Pixel Dino — arte 3D pixel art
                          </p>
                          <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-meso-mist">
                            Iconografía interactiva para gamification y badges de logros:
                            pasa el cursor para rotar el vóxel.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
