'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, useInView } from 'framer-motion';
import AmberCard from '@/components/ui/AmberCard';
import CanvasLoader from '@/components/3d/CanvasLoader';

const DinoPet3D = dynamic(() => import('@/components/3d/DinoPet3D'), {
  ssr: false,
  loading: () => <CanvasLoader label="Despertando al espécimen…" />,
});

const EASE = [0.22, 1, 0.36, 1] as const;

const VALUES = [
  {
    index: 'A',
    title: 'Software que capacita',
    text: 'Herramientas útiles que optimizan habilidades cotidianas y resuelven problemas reales de las personas.',
  },
  {
    index: 'B',
    title: 'Experiencias interactivas',
    text: 'Interfaces que respiran: animación, 3D en tiempo real y micro-detalles que hacen sentir vivo al producto.',
  },
  {
    index: 'C',
    title: 'Videojuegos impactantes',
    text: 'Mecánicas, mundos y atmósferas creadas con mentalidad indie y estándar AAA, del prototipo al build final.',
  },
];

/**
 * Sección "Sobre mí": bio editorial, pilares filosóficos
 * y el dino bebé low-poly en su vivarium 3D.
 */
export default function AboutSection() {
  const vivariumRef = useRef<HTMLDivElement>(null);
  const inView = useInView(vivariumRef, { once: false, margin: '-25% 0px -25% 0px' });

  return (
    <section id="sobre-mi" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Encabezado de sección */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex items-center gap-4"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-meso-amber">
            01 — Sobre mí
          </span>
          <span aria-hidden className="h-px flex-1 bg-meso-rock" />
        </motion.div>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* ---------- Vivarium 3D ---------- */}
          <motion.div
            ref={vivariumRef}
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.75, ease: EASE }}
            className="relative"
          >
            <div className="glass relative h-[400px] overflow-hidden rounded-3xl border border-meso-rock/80 shadow-card sm:h-[440px]">
              <div className="absolute inset-0">
                <DinoPet3D active={inView} />
              </div>

              {/* Etiqueta superior */}
              <div className="pointer-events-none absolute left-6 top-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-meso-mist">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22774F]" />
                Espécimen vivo
              </div>

              {/* Placa inferior */}
              <div className="pointer-events-none absolute inset-x-6 bottom-6 border-t border-meso-rock/80 pt-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-meso-amber">
                  Terópodo · Realista
                </p>
                <p className="mt-1 font-display text-sm text-meso-limestone/90">
                  Corre mientras visitas esta sección · clic para saltar
                </p>
              </div>
            </div>

            {/* Marcas estratigráficas al costado */}
            <span
              aria-hidden
              className="absolute -left-3 top-8 hidden h-24 w-px bg-gradient-to-b from-meso-amber/70 to-transparent sm:block"
            />
          </motion.div>

          {/* ---------- Bio editorial ---------- */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
          >
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.75rem]">
              Software que nace de la{' '}
              <span className="text-amber-gradient">curiosidad</span> y se excava con rigor.
            </h2>

            <p className="mt-5 leading-relaxed text-meso-limestone/80">
              Soy Alexandra Fiallo, desarrolladora enfocada en crear software útil que
              capacite a las personas, optimice sus habilidades cotidianas y cree
              experiencias interactivas y videojuegos impactantes.
            </p>
            <p className="mt-4 leading-relaxed text-meso-mist">
              Trabajo la interfaz como quien estudia un fósil: capa por capa, con paciencia
              editorial y obsesión por el detalle — del backend robusto al render 3D en
              tiempo real.
            </p>

            {/* Cita */}
            <blockquote className="mt-7 border-l-2 border-meso-amber/70 pl-5">
              <p className="font-display text-lg italic leading-relaxed text-meso-limestone/90">
                “El mejor código es el que parece natural: útil, claro y con un poco de
                vida propia.”
              </p>
            </blockquote>

            {/* Pilares */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {VALUES.map((v, i) => (
                <AmberCard key={v.index} delay={0.15 + i * 0.08} className="p-4">
                  <p className="font-mono text-[11px] tracking-[0.2em] text-meso-amber">
                    {v.index}
                  </p>
                  <p className="mt-2 font-display text-[15px] font-semibold leading-snug">
                    {v.title}
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-meso-mist">{v.text}</p>
                </AmberCard>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
