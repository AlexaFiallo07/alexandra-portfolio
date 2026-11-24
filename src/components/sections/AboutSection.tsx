'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, useInView } from 'framer-motion';
import AmberCard from '@/components/ui/AmberCard';
import BrachioCoffee from '@/components/dino/BrachioCoffee';
import CanvasLoader from '@/components/3d/CanvasLoader';

const DinoPet3D = dynamic(() => import('@/components/3d/DinoPet3D'), {
  ssr: false,
  loading: () => <CanvasLoader label="Despertando al corredor…" />,
});

const EASE = [0.22, 1, 0.36, 1] as const;

const VALUES = [
  {
    index: '01',
    title: 'Software que capacita',
    text: 'Herramientas útiles que optimizan habilidades cotidianas y resuelven problemas reales de las personas.',
  },
  {
    index: '02',
    title: 'Experiencias interactivas',
    text: 'Interfaces luminosas que respiran: animación fluida, detalle visual y micro-interacciones memorables.',
  },
  {
    index: '03',
    title: 'Videojuegos impactantes',
    text: 'Mecánicas, mundos y atmósferas creadas con mentalidad indie y estándar profesional, del prototipo al build.',
  },
];

/**
 * Sección "Sobre mí": tarjeta blanca luminosa con Brachiosaurus 2D
 * asomándose desde el borde tomando café de código.
 */
export default function AboutSection() {
  const vivariumRef = useRef<HTMLDivElement>(null);
  const vivariumInView = useInView(vivariumRef, { margin: '-60px' });

  return (
    <section id="sobre-mi" className="relative py-20 sm:py-28">
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        {/* Encabezado de sección */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: EASE }}
          className="flex items-center gap-4"
        >
          <span className="rounded-full border border-studio-purple/30 bg-studio-purple/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-studio-purple-deep">
            01 — Sobre mí
          </span>
          <span aria-hidden className="h-px flex-1 bg-studio-border" />
        </motion.div>

        {/* Tarjeta principal con Brachiosaurus asomándose desde el borde */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative mt-10"
        >
          <div className="relative overflow-visible rounded-3xl border border-studio-border bg-studio-card p-6 shadow-studio sm:p-10 lg:pr-64">
            {/* Brachiosaurus 2D asomándose desde el borde derecho tomando café */}
            <div
              aria-hidden
              className="pointer-events-none mx-auto mb-6 w-44 sm:w-52 lg:absolute lg:-right-6 lg:bottom-4 lg:mb-0 lg:w-64"
            >
              <div className="relative">
                <span className="absolute -left-6 top-2 rounded-full border border-studio-border bg-studio-pearl px-3 py-1 font-mono text-[10px] font-semibold text-studio-purple-deep shadow-sm">
                  ☕ Café + código
                </span>
                <BrachioCoffee className="h-auto w-full drop-shadow-[0_10px_18px_rgba(16,185,129,0.16)]" />
              </div>
            </div>

            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-bold leading-tight text-studio-ink sm:text-4xl lg:text-[2.6rem]">
                Software que nace de la{' '}
                <span className="text-studio-gradient">curiosidad</span> y se construye con rigor.
              </h2>

              <p className="mt-5 text-base leading-relaxed text-studio-slate">
                Soy <strong className="font-semibold text-studio-ink">Alexandra Fiallo</strong>,
                desarrolladora enfocada en crear software útil que capacite a las personas, optimice
                sus habilidades cotidianas y dé vida a experiencias interactivas y videojuegos
                impactantes.
              </p>
              <p className="mt-4 text-base leading-relaxed text-studio-slate">
                Combino arquitectura backend sólida (Python, Django, Node.js, bases de datos) con
                interfaces modernas y limpias — cuidando tanto la lógica del servidor como cada
                detalle visual que toca el usuario.
              </p>

              {/* Cita destacada */}
              <blockquote className="mt-7 rounded-2xl border-l-4 border-studio-green bg-studio-pearl/70 px-5 py-4">
                <p className="font-display text-base font-medium italic leading-relaxed text-studio-ink sm:text-lg">
                  “El mejor código es el que parece natural: útil, claro y con un poco de vida
                  propia.”
                </p>
              </blockquote>
            </div>
          </div>
        </motion.div>

        {/* Pilares filosóficos */}
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {VALUES.map((v, i) => (
            <AmberCard key={v.index} delay={0.1 + i * 0.08} className="p-6">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-studio-purple/30 bg-studio-purple/10 font-mono text-xs font-bold text-studio-purple-deep">
                {v.index}
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-studio-ink">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-studio-slate">{v.text}</p>
            </AmberCard>
          ))}
        </div>

        {/* ---------- Vivarium 3D: el dino corre cuando esta tarjeta entra en pantalla ---------- */}
        <motion.div
          ref={vivariumRef}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative mt-8 overflow-hidden rounded-3xl border border-studio-border bg-studio-card shadow-studio"
        >
          <div className="grid items-center gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_340px]">
            <div>
              <span className="rounded-full border border-studio-green/30 bg-studio-green/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-studio-green-deep">
                02 — Dino en vivo
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold text-studio-ink sm:text-3xl">
                Un compañero que corre contigo
              </h3>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-studio-slate">
                Este terópodo 3D cobra vida cuando llegas a esta sección: corre de un lado a otro,
                levanta polvo y salta si haces clic. Una pequeña forma de recordar que el código
                también puede tener vida propia.
              </p>
              <p className="mt-5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-studio-purple-deep">
                → Haz clic en el dino para verlo saltar
              </p>
            </div>

            <div className="studio-grid relative h-64 overflow-hidden rounded-2xl border border-studio-border bg-studio-pearl/50 sm:h-72">
              <DinoPet3D active={vivariumInView} />
              <span className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-studio-border bg-studio-card/90 px-2.5 py-1 font-mono text-[10px] font-semibold text-studio-slate shadow-sm">
                vivarium.tsx · R3F
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
