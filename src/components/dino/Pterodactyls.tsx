'use client';

import { useEffect, useRef } from 'react';

/**
 * Ambiente dinámico sobre el fondo claro:
 * - Pterodáctilos minimalistas (morado y verde) volando suavemente entre secciones
 * - Pequeñas hojas y partículas geométricas moradas y verdes flotando en el fondo
 */

interface Flyer {
  depth: number;
  top: number;
  dur: number;
  delay: number;
  scale: number;
  opacity: number;
  colorClass: string;
}

const FLYERS: Flyer[] = [
  { depth: 0.025, top: 14, dur: 44, delay: -8, scale: 0.95, opacity: 0.16, colorClass: 'text-studio-purple' },
  { depth: 0.045, top: 34, dur: 62, delay: -30, scale: 0.72, opacity: 0.14, colorClass: 'text-studio-green' },
  { depth: 0.075, top: 54, dur: 50, delay: -18, scale: 1.15, opacity: 0.15, colorClass: 'text-studio-purple-deep' },
  { depth: 0.035, top: 74, dur: 68, delay: -46, scale: 0.85, opacity: 0.14, colorClass: 'text-studio-green-deep' },
  { depth: 0.06, top: 90, dur: 56, delay: -22, scale: 1.0, opacity: 0.13, colorClass: 'text-studio-purple' },
];

const PARTICLES = [
  { left: '6%', top: '22%', kind: 'leaf', color: '#10B981', delay: '0s' },
  { left: '91%', top: '18%', kind: 'diamond', color: '#7C3AED', delay: '1.2s' },
  { left: '12%', top: '52%', kind: 'diamond', color: '#7C3AED', delay: '2.4s' },
  { left: '88%', top: '48%', kind: 'leaf', color: '#059669', delay: '0.8s' },
  { left: '8%', top: '80%', kind: 'leaf', color: '#10B981', delay: '1.9s' },
  { left: '93%', top: '76%', kind: 'ring', color: '#5B21B6', delay: '3.1s' },
];

function PteroSilhouette() {
  return (
    <svg viewBox="0 0 120 48" className="h-auto w-full" aria-hidden>
      <path d="M52 24 q10 -3 18 0 l16 -6 -4 6 8 2 -10 3 q-10 3 -20 1 z" fill="currentColor" />
      <g className="animate-wing-flap" style={{ animationDelay: 'inherit' }}>
        <path d="M56 24 q-14 -20 -40 -20 q22 6 30 22 z" fill="currentColor" />
      </g>
      <path d="M54 26 q-12 16 -34 18 q20 -8 28 -20 z" fill="currentColor" opacity="0.7" />
      <path d="M70 20 q6 -8 12 -8 q-4 5 -5 9 z" fill="currentColor" />
    </svg>
  );
}

export default function Pterodactyls({ className = '' }: { className?: string }) {
  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      FLYERS.forEach((f, i) => {
        const el = layerRefs.current[i];
        if (el) {
          const offset = -((y * f.depth) % 140);
          el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
        }
      });
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`}
    >
      {/* Partículas geométricas y hojas prehistóricas */}
      {PARTICLES.map((p, idx) => (
        <div
          key={idx}
          className="animate-leaf-drift absolute opacity-25"
          style={{ left: p.left, top: p.top, animationDelay: p.delay }}
        >
          {p.kind === 'leaf' && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 20 C6 9, 13 4, 20 4 C20 12, 15 18, 4 20 Z" fill={p.color} />
              <path d="M4 20 L15 9" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
          {p.kind === 'diamond' && (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="8" y="1" width="9" height="9" rx="2" transform="rotate(45 8 1)" fill={p.color} />
            </svg>
          )}
          {p.kind === 'ring' && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="5" stroke={p.color} strokeWidth="2.2" />
            </svg>
          )}
        </div>
      ))}

      {/* Pterodáctilos volando en parallax */}
      {FLYERS.map((f, i) => (
        <div
          key={i}
          ref={(el) => {
            layerRefs.current[i] = el;
          }}
          className="absolute w-full will-change-transform"
          style={{ top: `${f.top}vh` }}
        >
          <div
            className="animate-ptero-cross absolute left-0"
            style={{
              animationDuration: `${f.dur}s`,
              animationDelay: `${f.delay}s`,
              width: `${130 * f.scale}px`,
              opacity: f.opacity,
            }}
          >
            <div
              className={f.colorClass}
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
