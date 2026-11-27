'use client';

import { useEffect, useRef } from 'react';

/**
 * Velociraptor pixel art verde y morado estilo Chrome Dino.
 * Corre sobre una pista delgada integrada en la navbar; su avance y los
 * obstáculos se calculan desde el scroll real y las secciones de la página.
 */

const SECTION_OBSTACLES = [
  { id: 'sobre-mi', kind: 'cactus' },
  { id: 'stack', kind: 'div' },
  { id: 'proyectos', kind: 'cactus' },
  { id: 'formacion', kind: 'code' },
  { id: 'contacto', kind: 'div' },
] as const;

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
      className="h-6 w-auto drop-shadow-[0_2px_4px_rgba(58,35,112,0.32)] sm:h-7"
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
    <svg viewBox="0 0 9 11" className="h-3.5 w-auto sm:h-4" shapeRendering="crispEdges" aria-hidden>
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
  const obstacleRefs = useRef<Array<HTMLDivElement | null>>([]);
  const positionsRef = useRef<number[]>(SECTION_OBSTACLES.map(() => 0));
  const jumpLock = useRef<Set<number>>(new Set());

  useEffect(() => {
    let frame = 0;
    let running = false;
    let targetPct = 0;
    let currentPct = 0;
    let previousPct = 0;
    const timeouts: number[] = [];

    const render = () => {
      const pct = currentPct;
      const rail = railRef.current;
      const raptor = raptorRef.current;
      if (rail && raptor) {
        const travel = Math.max(rail.clientWidth - raptor.offsetWidth, 0);
        raptor.style.transform = `translate3d(${pct * travel}px, 0, 0)`;
      }
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${pct})`;
      if (pctRef.current) pctRef.current.textContent = `${Math.round(pct * 100)}%`;

      // Salta al cruzar un obstáculo, hacia delante o hacia atrás.
      const jumper = jumpRef.current;
      positionsRef.current.forEach((at, i) => {
        const crossed =
          (previousPct < at && pct >= at) || (previousPct > at && pct <= at);
        if (crossed && !jumpLock.current.has(i) && jumper) {
          jumpLock.current.add(i);
          jumper.classList.remove('animate-raptor-jump');
          void jumper.offsetWidth; // reinicia la animación si encadenan saltos
          jumper.classList.add('animate-raptor-jump');
          const id = window.setTimeout(() => {
            jumper.classList.remove('animate-raptor-jump');
            jumpLock.current.delete(i);
          }, 650);
          timeouts.push(id);
        }
      });
      previousPct = pct;
    };

    const tick = () => {
      // Interpolación suave hacia el scroll real, sin sacudidas.
      currentPct += (targetPct - currentPct) * 0.16;
      if (Math.abs(targetPct - currentPct) < 0.0005) currentPct = targetPct;
      render();
      if (currentPct !== targetPct) {
        frame = window.requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const schedule = () => {
      if (!running) {
        running = true;
        frame = window.requestAnimationFrame(tick);
      }
    };

    const update = () => {
      const doc = document.documentElement;
      const max = Math.max(doc.scrollHeight - window.innerHeight, 0);
      targetPct = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;

      // Cada obstáculo coincide con el inicio de una sección real.
      positionsRef.current = SECTION_OBSTACLES.map(({ id }) => {
        const section = document.getElementById(id);
        const top = section ? section.getBoundingClientRect().top + window.scrollY : 0;
        const at = max > 0 ? top / max : 0;
        return Math.min(Math.max(at, 0.06), 0.94);
      });
      obstacleRefs.current.forEach((el, i) => {
        if (el) el.style.left = `${positionsRef.current[i] * 100}%`;
      });
      schedule();
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    window.addEventListener('load', update);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      timeouts.forEach((id) => window.clearTimeout(id));
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      window.removeEventListener('load', update);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none w-full">
      <div className="flex w-full items-center gap-2">
        <div
          ref={railRef}
          className="relative h-7 flex-1 rounded-full border border-studio-border/45 bg-studio-card/40 px-1.5"
        >
          {/* Línea punteada y progreso morado */}
          <div className="absolute inset-x-1.5 top-1/2 border-t border-dotted border-studio-border" />
          <div
            ref={fillRef}
            className="absolute inset-x-1.5 top-1/2 h-[2px] -translate-y-1/2 origin-left rounded-full bg-gradient-to-r from-studio-purple-deep via-studio-purple to-studio-green"
            style={{ transform: 'scaleX(0)' }}
          />

          {SECTION_OBSTACLES.map((o, i) => (
            <div
              key={o.id}
              ref={(el) => {
                obstacleRefs.current[i] = el;
              }}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${((i + 1) / (SECTION_OBSTACLES.length + 1)) * 100}%` }}
            >
              {o.kind === 'cactus' ? (
                <CactusSprite />
              ) : (
                <span className="block rounded border border-studio-purple/40 bg-studio-card px-1 py-0.5 font-mono text-[7px] font-semibold tracking-tight text-studio-purple-deep shadow-sm">
                  {o.kind === 'div' ? '<div>' : '</>'}
                </span>
              )}
            </div>
          ))}

          {/* Capas separadas: avance horizontal, centrado y salto */}
          <div ref={raptorRef} className="absolute left-0 top-1/2 will-change-transform">
            <div className="-translate-y-1/2">
              <div ref={jumpRef}>
                <RaptorSprite />
              </div>
            </div>
          </div>
        </div>

        <span
          ref={pctRef}
          className="w-8 shrink-0 rounded-md border border-studio-border/60 bg-studio-card/60 px-1 py-0.5 text-center font-mono text-[8px] font-semibold text-studio-purple-deep"
        >
          0%
        </span>
      </div>
    </div>
  );
}
