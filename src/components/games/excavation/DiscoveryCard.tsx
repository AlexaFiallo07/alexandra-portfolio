'use client';

import { motion } from 'framer-motion';
import type { Specimen } from './types';

interface DiscoveryCardProps {
  specimen: Specimen;
  round: number;
  onNext: () => void;
}

/** Tarjeta glassmorphism con el hallazgo y el acceso a la siguiente excavación. */
export default function DiscoveryCard({ specimen, round, onNext }: DiscoveryCardProps) {
  const { spec } = specimen;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="absolute bottom-4 left-4 right-4 z-20 mx-auto max-w-md rounded-2xl border border-white/70 bg-white/75 p-4 shadow-studio-lg backdrop-blur-xl sm:p-5"
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: spec.accent }}
        />
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-studio-purple-deep">
          Hallazgo #{String(round).padStart(2, '0')} · 100 %
        </span>
      </div>

      <h4 className="mt-2 font-display text-xl font-bold leading-tight text-studio-ink sm:text-2xl">
        {spec.name}
      </h4>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span
          className="rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold"
          style={{ backgroundColor: `${spec.accent}1F`, color: spec.accent }}
        >
          {spec.period}
        </span>
        <span className="text-[11px] text-studio-slate">{spec.common}</span>
      </div>

      <p className="mt-3 text-[12px] leading-relaxed text-studio-slate">{spec.fact}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onNext}
          className="rounded-full bg-studio-purple px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-studio-purple-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-studio-purple"
        >
          → Siguiente excavación
        </button>
        {spec.href && (
          <a
            href={spec.href}
            className="rounded-full border border-studio-border bg-white/80 px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-studio-green-deep transition-colors hover:border-studio-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-studio-green"
          >
            {spec.hrefLabel ?? 'Ver más'}
          </a>
        )}
      </div>
      <p className="mt-2 font-mono text-[10px] text-studio-slate/80">
        Consejo: arrastra sobre el fósil para inspeccionarlo en 360°.
      </p>
    </motion.div>
  );
}
