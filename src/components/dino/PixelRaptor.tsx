'use client';

import { useEffect, useRef } from 'react';

/**
 * Velociraptor pixel art verde y morado estilo Chrome Dino:
 * corre sobre una línea punteada justo debajo del navbar sincronizado con
 * el scroll de la página, saltando cactus y etiquetas HTML (<div>, </>).
 */

const OBSTACLES: Array<{ at: number; kind: 'cactus' | 'div' | 'code' }> = [
  { at: 0.2, kind: 'cactus' },
  { at: 0.44, kind: 'div' },
  { at: 0.68, kind: 'cactus' },
  { at: 0.88, kind: 'code' },
];

/* Sprite del raptor: 16 × 10 píxeles (verde esmeralda + detalles morados) */
const BODY = [
  '..........dddd..',
  '.........dppbbdd',
  '.......dppbbbbbd',
  '..d....dppbbbebd',
  '.dbbddppbbbbbwsd',
  'dbbbbbbbbbbbbbbd',
  'dbbhhbbbbbbbbbbd',
  'dbbhhpbbbbbbbbd.',
  '.dbbbbbbbbbbbd..',
  '..dbbbbbbbbbbd..',
];

const PALETTE: Record<string, string> = {
  d: '#059669', // verde oscuro contorno
  b: '#10B981', // verde esmeralda cuerpo
  p: '#7C3AED', // acento morado vibrante (cresta / franja)
  e: '#18181B', // ojo carbón
  h: '#A7F3D0', // vientre / brillo menta
  w: '#FFFFFF', // diente y brillo del ojo
  s: '#5B21B6', // sombra morada profunda
};

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
      className="h-7 w-auto drop-shadow-[0_2px_4px_rgba(91,33,182,0.22)]"
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
            fill={PALETTE[c.code] ?? '#10B981'}
          />
        ))}
      {/* Brillo doble en el ojo y línea de la mandíbula */}
      <rect x="13.15" y="3.15" width="0.45" height="0.45" fill="#FFFFFF" />
      <rect x="12.2" y="3" width="0.3" height="0.3" fill="#FFFFFF" opacity="0.8" />
      <rect x="12" y="4.25" width="3" height="0.35" fill="#18181B" opacity="0.45" />
      <rect x="8.3" y="1.7" width="0.5" height="0.5" fill="#FFFFFF" opacity="0.65" />
      <g className="animate-leg-a">
        {LEGS_A.map((r, i) => (
          <g key={`a-${i}`}>
            <rect x={r.x} y={r.y} width={r.w} height={r.h} fill="#5B21B6" />
            {r.h === 1 && (
              <>
                <rect x={r.x} y={r.y + 0.6} width="1" height="0.5" fill="#FFFFFF" />
                <rect x={r.x + r.w - 1} y={r.y + 0.6} width="1" height="0.5" fill="#FFFFFF" />
              </>
            )}
          </g>
        ))}
      </g>
      <g className="animate-leg-b">
        {LEGS_B.map((r, i) => (
          <g key={`b-${i}`}>
            <rect x={r.x} y={r.y} width={r.w} height={r.h} fill="#5B21B6" />
            {r.h === 1 && (
              <>
                <rect x={r.x} y={r.y + 0.6} width="1" height="0.5" fill="#FFFFFF" />
                <rect x={r.x + r.w - 1} y={r.y + 0.6} width="1" height="0.5" fill="#FFFFFF" />
              </>
            )}
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Cactus en pixel art verde esmeralda. */
function CactusSprite() {
  return (
    <svg viewBox="0 0 9 11" className="h-4 w-auto" shapeRendering="crispEdges" aria-hidden>
      {/* Flor morada y contorno oscuro */}
      <rect x="3" y="0" width="3" height="1" fill="#7C3AED" />
      <rect x="3" y="1" width="3" height="10" fill="#059669" />
      <rect x="4" y="2" width="1.4" height="8" fill="#10B981" />
      <rect x="4" y="2" width="0.45" height="6" fill="#A7F3D0" />
      {/* Brazos con sombra y brillo */}
      <rect x="0" y="3" width="2.5" height="5" fill="#059669" />
      <rect x="1" y="4" width="1.2" height="3" fill="#10B981" />
      <rect x="0.5" y="4.5" width="0.4" height="2" fill="#A7F3D0" />
      <rect x="6.5" y="2" width="2.5" height="6" fill="#059669" />
      <rect x="7" y="3" width="1.2" height="4" fill="#10B981" />
      <rect x="7" y="3.5" width="0.4" height="3" fill="#A7F3D0" />
      {/* Base */}
      <rect x="2" y="10" width="5" height="1" fill="#5B21B6" />
    </svg>
  );
}

export default function PixelRaptor() {
  const railRef = useRef<HTMLDivElement>(null);
  const raptorRef = useRef<HTMLDivElement>(null);
  const jumpRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const jumpLock = useRef<Set<number>>(new Set());

  useEffect(() => {
    let raf = 0;
    const timeouts: number[] = [];

    const update = () => {
      raf = 0;
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

      OBSTACLES.forEach((o, i) => {
        const jumper = jumpRef.current;
        if (Math.abs(pct - o.at) < 0.018 && !jumpLock.current.has(i) && jumper) {
          jumpLock.current.add(i);
          // El salto vive en un elemento hijo para no sobrescribir el
          // translate3d horizontal que controla el scroll.
          jumper.classList.add('animate-raptor-jump');
          const id = window.setTimeout(() => {
            jumper.classList.remove('animate-raptor-jump');
            jumpLock.current.delete(i);
          }, 650);
          timeouts.push(id);
        }
      });
    };

    const scheduleUpdate = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      timeouts.forEach((id) => window.clearTimeout(id));
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-[74px] z-40 px-4 sm:px-8"
    >
      <div className="mx-auto flex max-w-5xl items-center gap-3">
        <div ref={railRef} className="relative h-8 flex-1">
          {/* Línea punteada estilo Chrome Dino */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-dotted border-studio-border" />
          {/* Progreso recorrido en morado → verde */}
          <div
            ref={fillRef}
            className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 origin-left bg-gradient-to-r from-studio-purple to-studio-green"
            style={{ transform: 'scaleX(0)' }}
          />

          {/* Obstáculos: cactus y etiquetas HTML */}
          {OBSTACLES.map((o, i) => (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `calc(${o.at * 100}% - 14px)` }}
            >
              {o.kind === 'cactus' ? (
                <CactusSprite />
              ) : (
                <span className="block rounded border border-studio-purple/40 bg-studio-card px-1.5 py-0.5 font-mono text-[8px] font-semibold tracking-tight text-studio-purple-deep shadow-sm">
                  {o.kind === 'div' ? '<div>' : '</>'}
                </span>
              )}
            </div>
          ))}

          {/* Raptor pixel art: capas separadas para scroll, centrado y salto */}
          <div ref={raptorRef} className="absolute left-0 top-1/2 will-change-transform">
            <div className="-translate-y-1/2">
              <div ref={jumpRef}>
                <RaptorSprite />
              </div>
            </div>
          </div>
        </div>

        {/* Porcentaje de scroll */}
        <span
          ref={pctRef}
          className="w-9 shrink-0 rounded-md border border-studio-border bg-studio-card px-1.5 py-0.5 text-center font-mono text-[9px] font-semibold text-studio-purple-deep"
        >
          0%
        </span>
      </div>
    </div>
  );
}
