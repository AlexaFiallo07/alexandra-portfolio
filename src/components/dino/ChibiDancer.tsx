'use client';

import { cn } from '@/lib/utils';

interface ChibiDancerProps {
  /** Activa el baile (hover sobre "Ver Demo" / "Código"). */
  dancing?: boolean;
  className?: string;
}

/**
 * Dinosaurio chibi/kawaii que baila (keyframe `dance` de tailwind.config)
 * cuando el usuario pasa el cursor sobre los botones de acción.
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
        <path d="M14 44 Q4 42 6 34 Q12 40 18 38 Z" fill="#6FCF97" />

        {/* Cuerpo */}
        <ellipse cx="32" cy="44" rx="17" ry="13" fill="#6FCF97" />
        <ellipse cx="33" cy="47" rx="11" ry="8" fill="#BFEED4" />

        {/* Patitas */}
        <ellipse cx="24" cy="56" rx="7" ry="4" fill="#3E9E70" />
        <ellipse cx="42" cy="56" rx="7" ry="4" fill="#3E9E70" />

        {/* Bracitos */}
        <ellipse cx="19" cy="42" rx="4.5" ry="3.5" fill="#3E9E70"
          transform={dancing ? 'rotate(-25 19 42)' : undefined} />
        <ellipse cx="47" cy="42" rx="4.5" ry="3.5" fill="#3E9E70"
          transform={dancing ? 'rotate(25 47 42)' : undefined} />

        {/* Placas dorsales doradas */}
        {[[22, 32], [32, 29], [42, 32]].map(([cx, cy]) => (
          <path
            key={`${cx}`}
            d={`M${cx - 5} ${cy + 5} Q${cx} ${cy - 7} ${cx + 5} ${cy + 5} Z`}
            fill="#C4A35A"
          />
        ))}

        {/* Cabeza */}
        <circle cx="34" cy="24" r="16" fill="#6FCF97" />
        <ellipse cx="42" cy="28" rx="8" ry="6" fill="#BFEED4" />

        {/* Ojos grandes (kawaii) */}
        <circle cx="30" cy="21" r="4.2" fill="#16324A" />
        <circle cx="41" cy="21" r="4.2" fill="#16324A" />
        <circle cx="31.4" cy="19.6" r="1.5" fill="#FFFFFF" />
        <circle cx="42.4" cy="19.6" r="1.5" fill="#FFFFFF" />

        {/* Rubor */}
        <ellipse cx="26" cy="27" rx="3" ry="2" fill="#F2A6C8" opacity="0.8" />
        <ellipse cx="45" cy="27" rx="3" ry="2" fill="#F2A6C8" opacity="0.8" />

        {/* Sonrisa */}
        <path
          d="M33 30 q3.5 3.5 7 0"
          stroke="#16324A"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Nariz */}
        <circle cx="48" cy="26" r="1.2" fill="#16324A" />
      </g>
    </svg>
  );
}
