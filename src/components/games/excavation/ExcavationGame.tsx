'use client';

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import dynamic from 'next/dynamic';
import CanvasLoader from '@/components/3d/CanvasLoader';
import FossilDigGame from '@/components/games/FossilDigGame';
import { cn } from '@/lib/utils';
import { hasWebGL } from '@/lib/webgl';
import { FOSSIL_CATALOG } from './catalog';
import DiscoveryCard from './DiscoveryCard';
import ToolBar from './ToolBar';
import { useExcavation } from './useExcavation';

const ExcavationScene = dynamic(() => import('./ExcavationScene'), {
  ssr: false,
  loading: () => <CanvasLoader label="Preparando el yacimiento 3D…" />,
});

/** Minijuego de excavación paleontológica con acabado PBR/HDRI. */
export default function ExcavationGame() {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  useEffect(() => setWebgl(hasWebGL()), []);

  const { round, specimen, tool, setTool, phase, progress, found, handleProgress, next } =
    useExcavation();
  const inspectDrag = useRef({ x: 0, y: 0 });
  const draggingInspect = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === '1') setTool('brush');
      if (event.key === '2') setTool('chisel');
      if (event.key === 'Escape') draggingInspect.current = false;
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setTool]);

  const handleNext = useCallback(() => {
    inspectDrag.current = { x: 0, y: 0 };
    next();
  }, [next]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (phase !== 'inspecting') return;
    draggingInspect.current = true;
    lastPointer.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (phase !== 'inspecting' || !draggingInspect.current) return;
    inspectDrag.current.x += (event.clientX - lastPointer.current.x) * 0.012;
    inspectDrag.current.y = Math.max(
      -0.6,
      Math.min(0.6, inspectDrag.current.y + (event.clientY - lastPointer.current.y) * 0.006),
    );
    lastPointer.current = { x: event.clientX, y: event.clientY };
  };

  const stopInspectDrag = () => {
    draggingInspect.current = false;
  };

  /* Sin WebGL: se mantiene la excavación 2D como respaldo. */
  if (webgl === false) return <FossilDigGame />;

  if (webgl === null) {
    return (
      <div className="mt-8 grid h-[420px] place-items-center rounded-3xl border border-studio-border bg-studio-card shadow-studio">
        <CanvasLoader label="Preparando el yacimiento 3D…" />
      </div>
    );
  }

  return (
    <div className="relative mt-8 overflow-hidden rounded-3xl border border-studio-border bg-studio-card shadow-studio">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px]">
        <div
          className={cn(
            'relative h-[380px] overflow-hidden bg-studio-pearl/50 sm:h-[460px] lg:h-[500px]',
            phase === 'inspecting' ? 'cursor-grab active:cursor-grabbing' : 'cursor-crosshair',
          )}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={stopInspectDrag}
          onPointerLeave={stopInspectDrag}
        >
          <ExcavationScene
            specimen={specimen}
            tool={tool}
            phase={phase}
            onProgress={handleProgress}
            inspectDrag={inspectDrag}
          />

          {phase === 'inspecting' && (
            <DiscoveryCard specimen={specimen} round={round} onNext={handleNext} />
          )}

          <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-md border border-studio-border bg-white/85 px-2.5 py-1 font-mono text-[10px] font-semibold text-studio-slate shadow-sm backdrop-blur">
            yacimiento · PBR + HDRI · {specimen.spec.shape}
          </span>
        </div>

        <aside className="border-t border-studio-border bg-studio-card p-5 sm:p-6 lg:border-l lg:border-t-0">
          <span className="rounded-full border border-studio-green/35 bg-studio-green/15 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-studio-green-deep">
            03 — Zona de excavación
          </span>
          <h3 className="mt-4 font-display text-2xl font-bold leading-tight text-studio-ink">
            Excava, limpia e inspecciona
          </h3>
          <p className="mt-3 text-[13px] leading-relaxed text-studio-slate">
            Arrastra el mouse sobre la tierra con el pincel o el cincel. La superficie se deforma en
            tiempo real y cambia de arena a tierra húmeda a medida que profundizas.
          </p>

          <ToolBar
            tool={tool}
            onToolChange={setTool}
            phase={phase}
            progress={progress}
            round={round}
            foundCount={found.length}
            total={FOSSIL_CATALOG.length}
          />
        </aside>
      </div>
    </div>
  );
}
