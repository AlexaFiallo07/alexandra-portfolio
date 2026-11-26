'use client';

import dynamic from 'next/dynamic';

const PteroFlock3D = dynamic(() => import('@/components/dino/PteroFlock3D'), {
  ssr: false,
  loading: () => null,
});

/**
 * Ambiente dinámico sobre el fondo claro:
 * - Pterodáctilos 3D low-poly (morado y verde) volando en un único Canvas
 * - Pequeñas hojas y partículas geométricas moradas y verdes flotando en el fondo
 */

const PARTICLES = [
  { left: '6%', top: '22%', kind: 'leaf', color: '#3E9D7B', delay: '0s' },
  { left: '91%', top: '18%', kind: 'diamond', color: '#6A4DAB', delay: '1.2s' },
  { left: '12%', top: '52%', kind: 'diamond', color: '#6A4DAB', delay: '2.4s' },
  { left: '88%', top: '48%', kind: 'leaf', color: '#2B775D', delay: '0.8s' },
  { left: '8%', top: '80%', kind: 'leaf', color: '#3E9D7B', delay: '1.9s' },
  { left: '93%', top: '76%', kind: 'ring', color: '#3A2370', delay: '3.1s' },
];

export default function Pterodactyls({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`}>
      {/* Partículas geométricas y hojas prehistóricas (decorativas) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
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
      </div>

      {/* Pterodáctilos 3D low-poly volando en parallax en un único Canvas */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <PteroFlock3D />
      </div>
    </div>
  );
}
