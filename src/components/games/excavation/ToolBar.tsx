'use client';

import { cn } from '@/lib/utils';
import type { ExcavationPhase, ExcavationTool } from './types';

interface ToolBarProps {
  tool: ExcavationTool;
  onToolChange: (tool: ExcavationTool) => void;
  phase: ExcavationPhase;
  progress: number;
  round: number;
  foundCount: number;
  total: number;
}

function BrushIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden className="h-5 w-5">
      <path d="M14.5 4.5 19.5 9.5 10 19H5v-5L14.5 4.5Z" strokeLinejoin="round" />
      <path d="m12.5 6.5 5 5M5 19c0-2 1-3 3-3" strokeLinecap="round" />
    </svg>
  );
}

function ChiselIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden className="h-5 w-5">
      <path d="m4 20 7.5-7.5M9 8.5 15.5 15" strokeLinecap="round" />
      <path d="M11.5 5.5 18.5 3 21 5.5 18.5 12.5 11.5 5.5Z" strokeLinejoin="round" />
      <path d="M4 20h4" strokeLinecap="round" />
    </svg>
  );
}

/** Selector de herramientas y panel de progreso del yacimiento. */
export default function ToolBar({
  tool,
  onToolChange,
  phase,
  progress,
  round,
  foundCount,
  total,
}: ToolBarProps) {
  const percent = Math.round(progress * 100);
  const locked = phase !== 'digging';

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-studio-purple-deep">
          Herramientas
        </span>
        <span className="font-mono text-[10px] text-studio-slate">ronda {round}</span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          aria-pressed={tool === 'brush'}
          disabled={locked}
          onClick={() => onToolChange('brush')}
          className={cn(
            'flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-studio-purple disabled:opacity-60',
            tool === 'brush'
              ? 'border-studio-purple bg-studio-purple/10 text-studio-purple-deep'
              : 'border-studio-border bg-studio-bg/70 text-studio-slate hover:border-studio-purple/60',
          )}
        >
          <BrushIcon />
          <span className="min-w-0">
            <span className="block">Pincel</span>
            <span className="block text-[10px] font-normal">Amplio · suave</span>
          </span>
          <kbd className="ml-auto font-mono text-[10px] opacity-60">1</kbd>
        </button>

        <button
          type="button"
          aria-pressed={tool === 'chisel'}
          disabled={locked}
          onClick={() => onToolChange('chisel')}
          className={cn(
            'flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-studio-purple disabled:opacity-60',
            tool === 'chisel'
              ? 'border-studio-green bg-studio-green/10 text-studio-green-deep'
              : 'border-studio-border bg-studio-bg/70 text-studio-slate hover:border-studio-green/60',
          )}
        >
          <ChiselIcon />
          <span className="min-w-0">
            <span className="block">Cincel</span>
            <span className="block text-[10px] font-normal">Fino · rápido</span>
          </span>
          <kbd className="ml-auto font-mono text-[10px] opacity-60">2</kbd>
        </button>
      </div>

      <div className="mt-5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-studio-green-deep">
            Superficie descubierta
          </span>
          <span className="font-mono text-xs font-bold text-studio-ink">{percent}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progreso de excavación"
          className="mt-2 h-2 overflow-hidden rounded-full bg-studio-pearl"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-studio-purple to-studio-green transition-[width] duration-150"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-2 font-mono text-[10px] leading-relaxed text-studio-slate">
          {phase === 'digging'
            ? 'Arrastra sobre la tierra. El hueso emerge al 88 %.'
            : phase === 'emerging'
              ? 'Limpiando y elevando el espécimen…'
              : 'Arrastra para girar el fósil 360°.'}
        </p>
      </div>

      <div className="mt-5 border-t border-studio-border pt-4">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-studio-purple-deep">
          Catálogo · {foundCount}/{total}
        </span>
        <p className="mt-1 text-[11px] leading-relaxed text-studio-slate">
          Cada partida entierra un fósil distinto en una posición aleatoria.
        </p>
      </div>
    </div>
  );
}
