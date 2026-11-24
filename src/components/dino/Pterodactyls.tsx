'use client';

import { useEffect, useRef } from 'react';

/**
 * Capa ambiental de pterodáctilos: siluetas que cruzan el fondo con
 * animación CSS (translateX + aleteo) y parallax de scroll por capas
 * aplicado con rAF sobre transform (60fps, sin re-renders).
 */

interface Flyer {
  /** Profundidad de parallax (0.02 = lejano, 0.09 = cercano) */
  depth: number;
  /** Desplazamiento vertical base en vh */
  top: number;
  /** Duración del cruce */
  dur: number;
  /** Retraso (negativo = empieza a mitad del cruce) */
  delay: number;
  /** Tamaño (1 = base) */
  scale: number;
  opacity: number;
}

const FLYERS: Flyer[] = [
  { depth: 0.02, top: 8, dur: 46, delay: -6, scale: 1, opacity: 0.16 },
  { depth: 0.045, top: 22, dur: 64, delay: -32, scale: 0.7, opacity: 0.12 },
  { depth: 0.07, top: 38, dur: 52, delay: -18, scale: 1.35, opacity: 0.2 },
  { depth: 0.03, top: 58, dur: 74, delay: -50, scale: 0.85, opacity: 0.1 },
  { depth: 0.06, top: 74, dur: 58, delay: -24, scale: 1.1, opacity: 0.14 },
];

/** Silueta de pterodáctilo ( alas con aleteo CSS ) */
function PteroSilhouette() {
  return (
    <svg viewBox="0 0 120 48" className="h-auto w-full" aria-hidden>
      {/* Cuerpo + pico */}
      <path d="M52 24 q10 -3 18 0 l16 -6 -4 6 8 2 -10 3 q-10 3 -20 1 z" fill="currentColor" />
      {/* Ala superior (aletea) */}
      <g className="animate-wing-flap" style={{ animationDelay: 'inherit' }}>
        <path d="M56 24 q-14 -20 -40 -20 q22 6 30 22 z" fill="currentColor" />
      </g>
      {/* Ala inferior */}
      <path d="M54 26 q-12 16 -34 18 q20 -8 28 -20 z" fill="currentColor" opacity="0.75" />
      {/* Cresta */}
      <path d="M70 20 q6 -8 12 -8 q-4 5 -5 9 z" fill="currentColor" />
    </svg>
  );
}

export default function Pterodactyls({ className = '' }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const y = window.scrollY;
      FLYERS.forEach((f, i) => {
        const el = layerRefs.current[i];
        if (el) el.style.transform = `translate3d(0, ${(-y * f.depth).toFixed(1)}px, 0)`;
      });
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {FLYERS.map((f, i) => (
        /* Capa con parallax (translate3d) */
        <div
          key={i}
          ref={(el) => {
            layerRefs.current[i] = el;
          }}
          className="absolute w-full will-change-transform"
          style={{ top: `${f.top}vh` }}
        >
          {/* Capa con cruce horizontal (CSS ptero-cross) */}
          <div
            className="animate-ptero-cross absolute left-0"
            style={{
              animationDuration: `${f.dur}s`,
              animationDelay: `${f.delay}s`,
              width: `${140 * f.scale}px`,
              opacity: f.opacity,
            }}
          >
            <div
              className="text-meso-amber"
              style={{ transform: `scaleX(${f.scale})`, transformOrigin: 'left center' }}
            >
              <PteroSilhouette />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
