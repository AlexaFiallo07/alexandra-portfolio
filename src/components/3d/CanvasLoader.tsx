interface CanvasLoaderProps {
  /** Texto del estado de excavación */
  label?: string;
}

/**
 * Spinner con temática de excavación 3D:
 * un anillo de roca que gira mientras un taladro ámbar perfora el estrato.
 */
export default function CanvasLoader({
  label = 'Excavando modelo 3D…',
}: CanvasLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex h-full w-full flex-col items-center justify-center gap-5"
    >
      <div className="relative h-16 w-16">
        {/* Estrato exterior */}
        <span className="absolute inset-0 rounded-full border-2 border-meso-rock" />
        {/* Taladro ámbar girando */}
        <span
          aria-hidden
          className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-meso-amber"
          style={{ animationDuration: '1.2s' }}
        />
        {/* Núcleo perforado */}
        <span
          aria-hidden
          className="absolute inset-3 animate-dig rounded-full border border-dashed border-meso-amber/50"
        />
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-meso-ember shadow-[0_0_12px_2px_rgba(106,77,171,0.6)]"
        />
      </div>
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-meso-mist">
        {label}
      </p>
    </div>
  );
}
