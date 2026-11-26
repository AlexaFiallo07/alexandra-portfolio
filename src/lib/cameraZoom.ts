'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

/** Límites del zoom para que el modelo nunca se salga de la vitrina. */
export const ZOOM_MIN = 0.62;
export const ZOOM_MAX = 1.75;

/**
 * Zoom interactivo de una escena R3F.
 *
 * `zoomRef` se lee dentro del Canvas (sin provocar renders de React) y el
 * estado `zoom` alimenta los botones/indicador. La rueda del mouse se captura
 * sobre el contenedor con `passive: false` para no desplazar la página.
 */
export function useCameraZoom(
  containerRef: RefObject<HTMLElement | null>,
  initial = 1,
) {
  const zoomRef = useRef(initial);
  const [zoom, setZoom] = useState(initial);

  const apply = useCallback((next: number) => {
    const clamped = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, next));
    zoomRef.current = clamped;
    setZoom(clamped);
  }, []);

  const zoomIn = useCallback(() => apply(zoomRef.current - 0.15), [apply]);
  const zoomOut = useCallback(() => apply(zoomRef.current + 0.15), [apply]);
  const reset = useCallback(() => apply(initial), [apply, initial]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      apply(zoomRef.current + Math.sign(event.deltaY) * 0.12);
    };

    element.addEventListener('wheel', onWheel, { passive: false });
    return () => element.removeEventListener('wheel', onWheel);
  }, [containerRef, apply]);

  return { zoom, zoomRef, zoomIn, zoomOut, reset };
}
