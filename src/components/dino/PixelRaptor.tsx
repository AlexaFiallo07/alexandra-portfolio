'use client';

import { useEffect, useRef } from 'react';

/**
 * Velociraptor en pixel art que corre por el borde superior de la pantalla,
 * sincronizado con el porcentaje de scroll. Salta obstáculos (etiquetas
 * <div> y bugs) a medida que los alcanza. Rendimiento: solo transform/opacity
 * vía requestAnimationFrame (sin re-renders de React en cada frame).
 */

/** Posición (0-1) de cada obstáculo en la vía. */
const OBSTACLES: Array<{ at: number; kind: 'div' | 'bug' }> = [
  { at: 0.24, kind: 'div' },
  { at: 0.5, kind: 'bug' },
  { at: 0.74, kind: 'div' },
  { at: 0.92, kind: 'bug' },
];

/* Sprite del raptor: 14 columnas × 10 filas */
const BODY = [
  '........ddd.....',
  '.......dbbbd....',
  '......dbbbbbd...',
  '..dd..dbebbbbd..',
  '.dbbbddbbbbbbbd.',
  'dbbbbbbbbbbbbbbd',
  'dbbggbbbbbbbbbbd',
  'dbbbbbbbbbbbbbd.',
  '.dbbbbbbbbbbbd..',
  '..dbbbbbbbbbd...',
];

const PALETTE: Record<string, string> = {
  d: '#6A4DAB',
  b: '#A98FD6',
  g: '#C4A35A',
  e: '#FFFFFF',
};

/** Patas alternadas (dos fotogramas con steps para el galope). */
const LEGS_A = [
  { x: 3, y: 10, w: 2, h: 3 },
  { x: 2, y: 13, w: 3, h: 1 },
  { x: 9, y: 10, w: 2, h: 3 },
  { x: 9, y: 13, w: 4, h: 1 },
];
const LEGS_B = [
  { x: 5, y: 10, w: 2, h: 3 },
  { x: 5, y: 13, w: 3, h: 1 },
  { x: 7, y: 10, w: 2, h: 3 },
  { x: 7, y: 13, w: 2, h: 1 },
];

function RaptorSprite() {
  const cells = BODY.flatMap((row, y) =>
    Array.from(row).map((code, x) => ({ code, x, y, key: `${x}-${y}` })),
  );

  return (
    <svg
      viewBox="0 0 16 15"
      className="h-7 w-auto drop-shadow-[0_0_6px_rgba(169,143,214,0.55)]"
      shapeRendering="crispEdges"
      aria-hidden
    >
      {cells
        .filter((c) => c.code !== '.')
        .map((c) => (
          <rect
            key={c.key}
            x={c.x}
            y={c.y}
            width={1}
            height={1}
            fill={PALETTE[c.code] ?? '#A98FD6'}
          />
        ))}
      {/* Patas — fotograma A (se oculta con steps) */}
      <g className="animate-leg-a">
        {LEGS_A.map((r, i) => (
          <rect key={`a-${i}`} x={r.x} y={r.y} width={r.w} height={r.h} fill="#6A4DAB" />
        ))}
      </g>
      {/* Patas — fotograma B */}
      <g className="animate-leg-b">
        {LEGS_B.map((r, i) => (
          <rect key={`b-${i}`} x={r.x} y={r.y} width={r.w} height={r.h} fill="#6A4DAB" />
        ))}
      </g>
    </svg>
  );
}

/** Obstáculo tipo bug (insecto pixel-art). */
function BugSprite() {
  return (
    <svg viewBox="0 0 10 8" className="h-4 w-auto" shapeRendering="crispEdges" aria-hidden>
      <rect x="3" y="1" width="4" height="6" fill="#C4A35A" />
      <rect x="4" y="0" width="2" height="1" fill="#C4A35A" />
      <rect x="2" y="2" width="1" height="1" fill="#C4A35A" />
      <rect x="7" y="2" width="1" height="1" fill="#C4A35A" />
      <rect x="2" y="5" width="1" height="1" fill="#C4A35A" />
      <rect x="7" y="5" width="1" height="1" fill="#C4A35A" />
      <rect x="4" y="3" width="2" height="1" fill="#120D1D" />
      <rect x="3" y="6" width="1" height="1" fill="#6A4DAB" />
      <rect x="6" y="6" width="1" height="1" fill="#6A4DAB" />
    </svg>
  );
}

export default function PixelRaptor() {
  const railRef = useRef<HTMLDivElement>(null);
  const raptorRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const jumpLock = useRef<Set<number>>(new Set());

  useEffect(() => {
    let raf = 0;

    const tick = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;

      const rail = railRef.current;
      const raptor = raptorRef.current;
      if (rail && raptor) {
        const travel = Math.max(rail.clientWidth - raptor.offsetWidth, 0);
        raptor.style.transform = `translate3d(${pct * travel}px, 0, 0)`;
      }
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${pct})`;
      if (pctRef.current) pctRef.current.textContent = `${Math.round(pct * 100)}%`;

      // Salto al alcanzar un obstáculo
      OBSTACLES.forEach((o, i) => {
        if (Math.abs(pct - o.at) < 0.014 && !jumpLock.current.has(i) && raptor) {
          jumpLock.current.add(i);
          raptor.classList.add('animate-raptor-jump');
          window.setTimeout(() => {
            raptor.classList.remove('animate-raptor-jump');
            jumpLock.current.delete(i);
          }, 650);
        }
      });

      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-[70px] z-40 px-3 sm:px-6"
    >
      <div ref={railRef} className="relative mx-auto h-8 max-w-5xl">
        {/* Vía */}
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 overflow-hidden">
          <div className="h-full w-full bg-meso-rock/70" />
          <div
            ref={fillRef}
            className="absolute inset-0 origin-left bg-gradient-to-r from-meso-ember to-meso-amber"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

        {/* Obstáculos */}
        {OBSTACLES.map((o, i) => (
          <div
            key={i}
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: `calc(${o.at * 100}% - 14px)` }}
          >
            {o.kind === 'div' ? (
              <span className="block rounded border border-meso-moss/70 bg-meso-stone/90 px-1.5 py-0.5 font-mono text-[8px] tracking-tight text-meso-moss shadow-[0_0_8px_rgba(196,163,90,0.35)]">
                &lt;div&gt;
              </span>
            ) : (
              <BugSprite />
            )}
          </div>
        ))}

        {/* Raptor */}
        <div ref={raptorRef} className="absolute left-0 top-1/2 -translate-y-1/2 will-change-transform">
          <RaptorSprite />
        </div>

        {/* Porcentaje de scroll */}
        <span
          ref={pctRef}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full pl-3 font-mono text-[9px] tracking-[0.16em] text-meso-mist"
        >
          0%
        </span>
      </div>
    </div>
  );
}
