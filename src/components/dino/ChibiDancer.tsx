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
      <defs>
        <linearGradient id="chibi-body" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="60%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="chibi-belly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D1FAE5" />
          <stop offset="100%" stopColor="#A7F3D0" />
        </linearGradient>
        <linearGradient id="chibi-plate" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>
        <pattern id="chibi-scales" width="8" height="7" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#FFFFFF" opacity="0.22" />
        </pattern>
        <filter id="chibi-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="1.6" stdDeviation="1.6" floodColor="#5B21B6" floodOpacity="0.2" />
        </filter>
      </defs>

      <g
        className={dancing ? 'animate-dance' : undefined}
        style={{ transformBox: 'fill-box', transformOrigin: 'center bottom' }}
      >
        {/* Sombra de estudio */}
        <ellipse cx="32" cy="60" rx="18" ry="2.6" fill="#5B21B6" opacity="0.12" />

        {/* Cola con relieve */}
        <path d="M16 44 Q4 43 6 33 Q6 30 9 31 Q12 40 20 38 Z" fill="url(#chibi-body)" stroke="#18181B" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M9 35 Q12 40 16 41" stroke="#D1FAE5" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7" />

        {/* Cuerpo y vientre */}
        <g filter="url(#chibi-shadow)">
          <ellipse cx="32" cy="44" rx="17" ry="13" fill="url(#chibi-body)" stroke="#18181B" strokeWidth="2.2" />
        </g>
        <ellipse cx="32" cy="44" rx="16" ry="12" fill="url(#chibi-scales)" />
        <path d="M20 38 Q28 34 36 36" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.55" />
        <ellipse cx="33" cy="47" rx="11" ry="8" fill="url(#chibi-belly)" stroke="#A7F3D0" strokeWidth="0.8" />
        <path d="M26 47 q7 2 14 0" stroke="#059669" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.35" />

        {/* Patitas con dedos */}
        <ellipse cx="24" cy="56" rx="7" ry="4" fill="url(#chibi-body)" stroke="#18181B" strokeWidth="1.8" />
        <ellipse cx="42" cy="56" rx="7" ry="4" fill="url(#chibi-body)" stroke="#18181B" strokeWidth="1.8" />
        {[21, 25, 39, 43].map((x) => (
          <ellipse key={x} cx={x} cy="58" rx="1.8" ry="1.1" fill="#FFFFFF" stroke="#18181B" strokeWidth="0.7" />
        ))}

        {/* Bracitos: conservan la rotación al bailar */}
        <ellipse
          cx="18"
          cy="42"
          rx="4.5"
          ry="3.5"
          fill="url(#chibi-body)"
          stroke="#18181B"
          strokeWidth="1.8"
          transform={dancing ? 'rotate(-28 18 42)' : undefined}
        />
        <ellipse
          cx="48"
          cy="42"
          rx="4.5"
          ry="3.5"
          fill="url(#chibi-body)"
          stroke="#18181B"
          strokeWidth="1.8"
          transform={dancing ? 'rotate(28 48 42)' : undefined}
        />
        <circle cx="16" cy="42" r="1.6" fill="#D1FAE5" opacity="0.8" />
        <circle cx="50" cy="42" r="1.6" fill="#D1FAE5" opacity="0.8" />

        {/* Placas dorsales moradas con brillo */}
        {[[22, 31], [32, 28], [42, 31]].map(([cx, cy]) => (
          <g key={`${cx}`}>
            <path
              d={`M${cx - 5} ${cy + 5} Q${cx} ${cy - 7} ${cx + 5} ${cy + 5} Z`}
              fill="url(#chibi-plate)"
              stroke="#18181B"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path d={`M${cx - 2} ${cy + 1} Q${cx} ${cy - 4} ${cx + 2} ${cy + 1}`} stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.55" />
          </g>
        ))}

        {/* Cabeza: cráneo, hocico, ojos dobles brillos y expresión */}
        <g filter="url(#chibi-shadow)">
          <circle cx="34" cy="24" r="15.5" fill="url(#chibi-body)" stroke="#18181B" strokeWidth="2.2" />
        </g>
        <path d="M25 16 Q33 11 42 15" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.55" />
        <ellipse cx="43" cy="28" rx="7.5" ry="5.5" fill="url(#chibi-belly)" stroke="#A7F3D0" strokeWidth="0.9" />
        <ellipse cx="48" cy="27" rx="1.7" ry="1.2" fill="#18181B" />
        {/* Cejas inclinadas */}
        <path d="M27 14 q3 -2 5 0" stroke="#18181B" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <path d="M39 14 q3 -1 5 1" stroke="#18181B" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        {/* Ojos grandes (kawaii) */}
        <circle cx="30" cy="21" r="4" fill="#18181B" />
        <circle cx="41" cy="21" r="4" fill="#18181B" />
        <circle cx="31.3" cy="19.6" r="1.4" fill="#FFFFFF" />
        <circle cx="42.3" cy="19.6" r="1.4" fill="#FFFFFF" />
        <circle cx="28.9" cy="22.7" r="0.7" fill="#FFFFFF" opacity="0.85" />
        <circle cx="39.9" cy="22.7" r="0.7" fill="#FFFFFF" opacity="0.85" />
        {/* Rubor morado suave */}
        <ellipse cx="25" cy="27" rx="3" ry="2" fill="#7C3AED" opacity="0.28" />
        <ellipse cx="45" cy="27" rx="3" ry="2" fill="#7C3AED" opacity="0.28" />
        {/* Sonrisa con lengüita */}
        <path d="M33 30 q3.5 3.5 7 0" stroke="#18181B" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M36 32 q2 1.6 3.5 -0.2" stroke="#7C3AED" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.75" />
      </g>
    </svg>
  );
}
