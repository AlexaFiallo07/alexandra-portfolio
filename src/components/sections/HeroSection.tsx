'use client';

import { motion } from 'framer-motion';
import HeroTRexStudio from '@/components/dino/HeroTRexStudio';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Hero luminoso estilo estudio interactivo / brutalismo suave:
 * titular de alto contraste (#18181B), CTAs morados (#7C3AED / #5B21B6),
 * acentos verdes (#10B981) y escena ilustrada interactiva del T-Rex con gafas moradas.
 */
export default function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-16 pt-32 sm:pt-36"
    >
      {/* Acentos geométricos suaves en el fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-28 top-24 h-[420px] w-[420px] rounded-full bg-studio-purple/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-12 h-[360px] w-[360px] rounded-full bg-studio-green/10 blur-3xl"
      />

      {/* Etiqueta vertical lateral */}
      <span
        aria-hidden
        className="absolute left-5 top-1/2 hidden -translate-y-1/2 rotate-180 font-mono text-[10px] font-semibold uppercase tracking-[0.42em] text-studio-slate/60 xl:block"
        style={{ writingMode: 'vertical-rl' }}
      >
        Multiverso Jurásico · Studio 2026
      </span>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        {/* ---------- Columna editorial ---------- */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE }}
            className="inline-flex items-center gap-2.5 rounded-full border border-studio-border bg-studio-card px-3.5 py-1.5 shadow-studio"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-studio-green" />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-studio-purple-deep">
              El Multiverso Jurásico del Código
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
            className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight text-studio-ink sm:text-6xl lg:text-7xl"
          >
            Alexandra
            <br />
            <span className="text-studio-gradient">Fiallo</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.16, ease: EASE }}
            className="mt-6 max-w-xl font-mono text-[13px] font-semibold uppercase leading-relaxed tracking-[0.14em] text-studio-purple-deep sm:text-sm"
          >
            Desarrolladora de Software Full-Stack
            <span className="mx-2 text-studio-green">|</span>
            Backend &amp; Mobile
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.24, ease: EASE }}
            className="mt-5 max-w-xl text-base leading-relaxed text-studio-slate sm:text-lg"
          >
            Creo software útil que{' '}
            <strong className="font-semibold text-studio-ink">capacita a las personas</strong>,
            optimiza sus habilidades cotidianas y convierte el código en{' '}
            <span className="font-semibold text-studio-purple-deep">
              experiencias interactivas y videojuegos impactantes
            </span>
            .
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.32, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#proyectos"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-studio-purple-deep bg-studio-purple px-7 py-3.5 text-sm font-semibold text-white shadow-brutal transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-studio-purple-deep"
            >
              Explorar proyectos
              <span aria-hidden className="inline-block transition-transform group-hover:translate-y-0.5">
                ↓
              </span>
            </a>
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 rounded-full border border-studio-border bg-studio-card px-7 py-3.5 text-sm font-semibold text-studio-ink shadow-studio transition-all hover:-translate-y-0.5 hover:border-studio-green hover:text-studio-green-deep"
            >
              Enviar una señal
            </a>
          </motion.div>

          {/* Etiquetas de dominio */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.2em]"
          >
            <span className="rounded-md border border-studio-purple/25 bg-studio-purple/10 px-2.5 py-1 text-studio-purple-deep">
              Backend
            </span>
            <span className="rounded-md border border-studio-green/30 bg-studio-green/10 px-2.5 py-1 text-studio-green-deep">
              Frontend
            </span>
            <span className="rounded-md border border-studio-border bg-studio-pearl px-2.5 py-1 text-studio-ink">
              Mobile
            </span>
          </motion.div>
        </div>

        {/* ---------- Escena interactiva del T-Rex Programador ---------- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.25, ease: EASE }}
          className="relative"
        >
          <div className="relative aspect-[4/4.3] w-full overflow-hidden rounded-3xl border border-studio-border bg-studio-card shadow-studio-lg sm:aspect-square lg:aspect-[4/4.4]">
            {/* Barra superior tipo ventana de estudio */}
            <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between border-b border-studio-border bg-studio-card/90 px-5 py-3 backdrop-blur-sm">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-studio-purple" />
                <span className="h-2.5 w-2.5 rounded-full bg-studio-green" />
                <span className="h-2.5 w-2.5 rounded-full bg-studio-border" />
              </div>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-studio-slate">
                trex_studio.tsx
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-studio-green/15 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-studio-green-deep">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-studio-green" />
                Online
              </span>
            </div>

            {/* Escena ilustrada interactiva */}
            <div className="absolute inset-0 pt-10">
              <HeroTRexStudio />
            </div>

            {/* Pie de tarjeta */}
            <div className="pointer-events-none absolute inset-x-4 bottom-4 z-30 flex items-center justify-between rounded-2xl border border-studio-border bg-studio-card/95 px-4 py-2.5 shadow-studio backdrop-blur-sm">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-studio-purple-deep">
                  Espécimen 001
                </p>
                <p className="font-display text-xs font-semibold text-studio-ink sm:text-sm">
                  T-Rex Dev · Gafas moradas &amp; stickers
                </p>
              </div>
              <span className="rounded-lg bg-studio-pearl px-2.5 py-1 font-mono text-[10px] font-medium text-studio-slate">
                Mueve el mouse · clic
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
