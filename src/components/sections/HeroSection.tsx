'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import CanvasLoader from '@/components/3d/CanvasLoader';

const FossilHeroScene = dynamic(() => import('@/components/3d/FossilHeroScene'), {
  ssr: false,
  loading: () => <CanvasLoader label="Desenterrando espécimen…" />,
});

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Hero editorial: titular, filosofía, CTAs y vitrina 3D
 * con cráneo fósil interactivo (rotación 360° + parallax de cursor).
 */
export default function HeroSection() {
  return (
    <section id="inicio" className="relative flex min-h-[100svh] items-center overflow-hidden pb-16 pt-32 sm:pt-36">
      {/* --- Fondo: resplandor ámbar y estratos --- */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/4 h-[540px] w-[540px] rounded-full bg-[radial-gradient(circle,rgba(102,87,226,0.14),transparent_65%)] blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-meso-night"
      />
      {/* Líneas estratigráficas de fondo */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.35]">
        {[18, 38, 58, 78].map((top) => (
          <div
            key={top}
            className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-meso-rock to-transparent"
            style={{ top: `${top}%` }}
          />
        ))}
      </div>

      {/* Texto vertical decorativo */}
      <span
        aria-hidden
        className="absolute left-5 top-1/2 hidden -translate-y-1/2 rotate-180 font-mono text-[10px] uppercase tracking-[0.5em] text-meso-mist/50 xl:block"
        style={{ writingMode: 'vertical-rl' }}
      >
        Era Mesozoica · Portafolio 2026
      </span>

      {/* Dinosaurios cruzando corriendo al fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-16 z-0 overflow-hidden"
      >
        {[
          { dur: '28s', delay: '0s', cls: 'bottom-0 text-meso-rock', h: 'h-14' },
          { dur: '38s', delay: '-12s', cls: 'bottom-10 text-meso-moss/30', h: 'h-10' },
          { dur: '52s', delay: '-30s', cls: 'bottom-4 text-meso-rock/80', h: 'h-20' },
        ].map((d) => (
          <div
            key={d.dur}
            className={`run-across absolute ${d.cls}`}
            style={{ animationDuration: d.dur, animationDelay: d.delay }}
          >
            <svg viewBox="0 0 100 60" className={`${d.h} w-auto`} fill="currentColor">
              <ellipse cx="44" cy="26" rx="17" ry="9" />
              <polygon points="28,22 2,14 4,24 26,31" />
              <polygon points="58,20 72,12 84,14 86,20 74,24 60,26" />
              <polygon points="84,20 97,26 82,27" />
              <polygon points="66,27 74,32 70,34 64,31" />
              <polygon points="34,30 28,44 34,52 40,42 44,34" />
              <polygon points="56,31 60,44 56,53 52,45 50,35" />
              <polygon points="40,17 44,10 48,17 52,13 56,18" />
            </svg>
          </div>
        ))}
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
        {/* ---------- Columna editorial ---------- */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-meso-amber"
          >
            <span aria-hidden className="h-px w-10 bg-meso-amber/60" />
            Portafolio · Fósil minimalista
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
            className="mt-6 font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Alexandra
            <br />
            <span className="text-amber-gradient">Fiallo</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease: EASE }}
            className="mt-6 max-w-xl font-mono text-[13px] uppercase leading-relaxed tracking-[0.14em] text-meso-mist sm:text-sm"
          >
            Full Stack &amp; 3D Web Developer
            <span className="mx-2 text-meso-amber">|</span>
            Creadora de Videojuegos (Indie &amp; AAA)
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.26, ease: EASE }}
            className="mt-5 max-w-xl text-base leading-relaxed text-meso-limestone/75 sm:text-lg"
          >
            Creo software útil que <em className="not-italic text-meso-limestone">capacite a las personas</em>,
            optimice sus habilidades cotidianas y convierta el código en{' '}
            <span className="text-amber-gradient">experiencias interactivas y videojuegos impactantes</span>.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.36, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#proyectos"
              className="group rounded-full bg-meso-amber px-7 py-3.5 text-sm font-semibold text-meso-night shadow-amber transition-all hover:-translate-y-0.5 hover:bg-meso-ember hover:shadow-amber-lg"
            >
              Explorar la excavación
              <span aria-hidden className="ml-2 inline-block transition-transform group-hover:translate-y-0.5">
                ↓
              </span>
            </a>
            <a
              href="#contacto"
              className="rounded-full border border-meso-rock px-7 py-3.5 text-sm text-meso-limestone transition-all hover:-translate-y-0.5 hover:border-meso-amber/60 hover:text-meso-amber"
            >
              Enviar una señal
            </a>
          </motion.div>

          {/* Estratos decorativos */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-12 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.24em] text-meso-mist/60"
          >
            <span className="text-[#9C6B3F]">Triásico</span>
            <span aria-hidden className="h-px w-6 bg-meso-rock" />
            <span className="text-[#22774F]">Jurásico</span>
            <span aria-hidden className="h-px w-6 bg-meso-rock" />
            <span className="text-meso-amber">Cretácico</span>
          </motion.div>
        </div>

        {/* ---------- Vitrina 3D ---------- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: EASE }}
          className="relative"
        >
          <div className="glass relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-meso-rock/80 shadow-card sm:aspect-square lg:aspect-[4/5]">
            {/* Canvas del cráneo */}
            <div className="absolute inset-0">
              <FossilHeroScene />
            </div>

            {/* Esquinas de vitrina (brackets HUD) */}
            {[
              'left-4 top-4 border-l-2 border-t-2',
              'right-4 top-4 border-r-2 border-t-2',
              'left-4 bottom-4 border-b-2 border-l-2',
              'right-4 bottom-4 border-b-2 border-r-2',
            ].map((pos) => (
              <span
                key={pos}
                aria-hidden
                className={`pointer-events-none absolute h-6 w-6 border-meso-amber/60 ${pos}`}
              />
            ))}

            {/* Etiqueta superior derecha */}
            <div className="pointer-events-none absolute right-6 top-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-meso-mist">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-meso-amber" />
              En vivo
            </div>

            {/* Placa de especimen */}
            <div className="pointer-events-none absolute inset-x-6 bottom-6">
              <div className="flex items-end justify-between gap-3 border-t border-meso-rock/80 pt-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-meso-amber">
                    Espécimen 001
                  </p>
                  <p className="mt-1 font-display text-sm text-meso-limestone/90">
                    Cráneo fósil · Rotación 360°
                  </p>
                </div>
                <p className="hidden text-right font-mono text-[9px] uppercase leading-relaxed tracking-[0.18em] text-meso-mist/70 sm:block">
                  Mueve el cursor
                  <br />
                  para excavar
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Indicador de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        aria-hidden
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-meso-mist/60">
          Desliza para excavar
        </span>
        <span className="relative h-10 w-px overflow-hidden bg-meso-rock">
          <motion.span
            animate={{ y: ['-100%', '100%'] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-x-0 h-1/2 bg-meso-amber"
          />
        </span>
      </motion.div>
    </section>
  );
}
