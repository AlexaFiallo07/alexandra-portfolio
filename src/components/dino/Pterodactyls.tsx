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
      {/* Ala trasera / cola */}
      <path d="M54 26 Q40 40 16 46 Q34 36 44 26 Z" fill="currentColor" opacity="0.72" />
      <path d="M50 26 Q38 32 24 42" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.4" />

      {/* Ala delantera con varillas de la membrana */}
      <g className="animate-wing-flap" style={{ animationDelay: 'inherit' }}>
        <path d="M58 24 Q44 6 10 4 Q20 11 26 19 Q16 15 6 18 Q22 25 48 28 Z" fill="currentColor" />
        <path d="M56 25 Q40 14 14 6 M54 26 Q36 21 12 18 M52 27 Q34 26 24 23" stroke="#FFFFFF" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.38" />
        <path d="M56 24 Q42 8 12 5" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.5" />
      </g>

      {/* Cuerpo, cuello y pecho */}
      <path d="M50 25 Q62 19 74 22 L92 18 Q96 18 96 22 Q96 27 90 28 L70 31 Q58 33 50 28 Z" fill="currentColor" />
      <path d="M60 25 Q72 23 86 22" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.42" />

      {/* Cabeza, cresta, ojo y pico */}
      <path d="M86 15 Q96 11 102 16 L106 15 L100 20 Q94 24 86 21 Z" fill="currentColor" />
      <path d="M99 14 Q104 9 110 11 L104 17 Z" fill="currentColor" opacity="0.85" />
      <path d="M104 17 L119 21 L104 23 Z" fill="currentColor" />
      <path d="M104 23 L116 25 L103 26 Z" fill="currentColor" opacity="0.7" />
      <circle cx="98" cy="17" r="1.3" fill="#FFFFFF" opacity="0.85" />
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
