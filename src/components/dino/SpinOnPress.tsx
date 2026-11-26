'use client';

import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SpinOnPressProps {
  children: ReactNode;
  className?: string;
  label?: string;
}

/**
 * Envoltorio para dinosaurios 2D: al presionarlos giran 360° completos.
 *
 * La animación se aplica a un hijo con `key` propio para que cada clic
 * reinicie el giro, y el envoltorio centra siempre la pieza (alineación
 * consistente en tarjetas, footer y fondo).
 */
export default function SpinOnPress({
  children,
  className,
  label = 'Girar dinosaurio 360°',
}: SpinOnPressProps) {
  const [spinKey, setSpinKey] = useState(0);

  const spin = () => setSpinKey((value) => value + 1);

  return (
    <span
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={spin}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          spin();
        }
      }}
      className={cn(
        'pointer-events-auto inline-flex cursor-pointer items-center justify-center [perspective:800px] focus:outline-none focus-visible:ring-2 focus-visible:ring-studio-purple',
        className,
      )}
    >
      <span
        key={spinKey}
        className="animate-dino-spin block [transform-style:preserve-3d] motion-reduce:animate-none"
      >
        {children}
      </span>
    </span>
  );
}
