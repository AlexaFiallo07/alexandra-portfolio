'use client';

import { useCallback, useRef } from 'react';

/** Duración del giro completo al presionar un dinosaurio. */
export const SPIN_DURATION = 1.05;

interface SpinState {
  start: number;
}

/**
 * Giro 360° independiente de la dirección y del salto.
 *
 * Devuelve un desplazamiento en radianes que va de 0 a 2π y vuelve a 0 al
 * terminar. Así la rotación de la pieza se puede sumar a la orientación que
 * ya tenga (mirar al cursor, dirección de carrera, etc.) sin pelear con ella.
 */
export function useSpin360() {
  const spin = useRef<SpinState | null>(null);

  const triggerSpin = useCallback(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    spin.current = { start: performance.now() / 1000 };
  }, []);

  const cancelSpin = useCallback(() => {
    spin.current = null;
  }, []);

  const spinOffset = useCallback((now: number) => {
    const current = spin.current;
    if (!current) return 0;

    const progress = (now - current.start) / SPIN_DURATION;
    if (progress >= 1) {
      spin.current = null;
      return 0;
    }

    // Ease in/out cúbico: arranca y termina suave, como la vitrina del hero.
    const eased =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    return eased * Math.PI * 2;
  }, []);

  return { triggerSpin, cancelSpin, spinOffset };
}
