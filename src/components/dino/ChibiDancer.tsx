'use client';

import { cn } from '@/lib/utils';

interface ChibiDancerProps {
  /** Activa el baile (hover sobre "Ver Demo" / "Código"). */
  dancing?: boolean;
  className?: string;
}

/**
 * Dinosaurio chibi/kawaii verde y morado que baila al pasar el cursor
 * sobre los botones de "Ver Demo" o "Código en GitHub".
 */
export default function ChibiDancer({ dancing = false, className }: ChibiDancerProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn('h-9 w-9', className)}
      role="img"
      aria-label={dancing ? 'Dinosaurio chibi bailando' : 'Dinosaurio chibi'}
    >
      <g
        className={dancing ? 'animate-dance' : undefined}
        style={{ transformBox: 'fill-box', transformOrigin: 'center bottom' }}
      >
        {/* Cola */}
        <path d="M14 44 Q4 42 6 34 Q12 40 18 38 Z" fill="#10B981" stroke="#18181B" strokeWidth="2" strokeLinejoin="round" />

        {/* Cuerpo */}
        <ellipse cx="32" cy="44" rx="17" ry="13" fill="#10B981" stroke="#18181B" strokeWidth="2.2" />
        <ellipse cx="33" cy="47" rx="11" ry="8" fill="#D1FAE5" />

        {/* Patitas */}
        <ellipse cx="24" cy="56" rx="7" ry="4" fill="#059669" stroke="#18181B" strokeWidth="1.8" />
        <ellipse cx="42" cy="56" rx="7" ry="4" fill="#059669" stroke="#18181B" strokeWidth="1.8" />

        {/* Bracitos */}
        <ellipse
          cx="18"
          cy="42"
          rx="4.5"
          ry="3.5"
          fill="#10B981"
          stroke="#18181B"
          strokeWidth="1.8"
          transform={dancing ? 'rotate(-28 18 42)' : undefined}
        />
        <ellipse
          cx="48"
          cy="42"
          rx="4.5"
          ry="3.5"
          fill="#10B981"
          stroke="#18181B"
          strokeWidth="1.8"
          transform={dancing ? 'rotate(28 48 42)' : undefined}
        />

        {/* Placas dorsales moradas */}
        {[[22, 31], [32, 28], [42, 31]].map(([cx, cy]) => (
          <path
            key={`${cx}`}
            d={`M${cx - 5} ${cy + 5} Q${cx} ${cy - 7} ${cx + 5} ${cy + 5} Z`}
            fill="#7C3AED"
            stroke="#18181B"
            strokeWidth="1.6"
          />
        ))}

        {/* Cabeza */}
        <circle cx="34" cy="24" r="15.5" fill="#10B981" stroke="#18181B" strokeWidth="2.2" />
        <ellipse cx="42" cy="28" rx="7.5" ry="5.5" fill="#A7F3D0" />

        {/* Ojos grandes (kawaii) */}
        <circle cx="30" cy="21" r="4" fill="#18181B" />
        <circle cx="41" cy="21" r="4" fill="#18181B" />
        <circle cx="31.3" cy="19.6" r="1.4" fill="#FFFFFF" />
        <circle cx="42.3" cy="19.6" r="1.4" fill="#FFFFFF" />

        {/* Rubor morado suave */}
        <ellipse cx="26" cy="27" rx="3" ry="2" fill="#7C3AED" opacity="0.28" />
        <ellipse cx="45" cy="27" rx="3" ry="2" fill="#7C3AED" opacity="0.28" />

        {/* Sonrisa */}
        <path d="M33 30 q3.5 3.5 7 0" stroke="#18181B" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}
