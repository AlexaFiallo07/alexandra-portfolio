interface CanvasLoaderProps {
  /** Texto del estado de carga */
  label?: string;
}

/**
 * Spinner de estudio para las escenas 3D:
 * anillo morado girando, núcleo verde y etiqueta monoespaciada.
 * Usa la paleta clara "Studio" para no romper el diseño de Antigravity.
 */
export default function CanvasLoader({
  label = 'Cargando escena 3D…',
}: CanvasLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex h-full w-full flex-col items-center justify-center gap-5"
    >
      <div className="relative h-16 w-16">
        <span className="absolute inset-0 rounded-full border-2 border-studio-border" />
        <span
          aria-hidden
          className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-studio-purple"
          style={{ animationDuration: '1.2s' }}
        />
        <span
          aria-hidden
          className="absolute inset-3 rounded-full border border-dashed border-studio-green/50"
        />
        <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-studio-green shadow-[0_0_12px_2px_rgba(16,185,129,0.35)]" />
      </div>
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-studio-slate">
        {label}
      </p>
    </div>
  );
}
