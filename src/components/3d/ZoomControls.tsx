'use client';

interface ZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  className?: string;
  label?: string;
}

/** Controles accesibles de zoom. `zoom < 1` acerca, `zoom > 1` aleja. */
export default function ZoomControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
  className = 'bottom-3 right-3',
  label = 'Zoom de la escena',
}: ZoomControlsProps) {
  const button =
    'flex h-7 w-7 items-center justify-center rounded-full border border-studio-border bg-studio-card/95 font-mono text-sm font-bold text-studio-ink shadow-studio transition-colors hover:border-studio-purple hover:text-studio-purple-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-studio-purple';

  return (
    <div
      role="group"
      aria-label={label}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
      className={`absolute z-40 flex items-center gap-1 rounded-full border border-studio-border bg-studio-card/85 p-1 shadow-studio backdrop-blur-sm ${className}`}
    >
      <button type="button" aria-label="Alejar" title="Alejar" onClick={onZoomOut} className={button}>
        −
      </button>
      <span
        aria-live="polite"
        className="min-w-[38px] text-center font-mono text-[10px] font-semibold tabular-nums text-studio-purple-deep"
      >
        {Math.round(100 / zoom)}%
      </span>
      <button type="button" aria-label="Acercar" title="Acercar" onClick={onZoomIn} className={button}>
        +
      </button>
      <button
        type="button"
        aria-label="Restablecer zoom"
        title="Restablecer zoom"
        onClick={onReset}
        className={button}
      >
        ↺
      </button>
    </div>
  );
}
