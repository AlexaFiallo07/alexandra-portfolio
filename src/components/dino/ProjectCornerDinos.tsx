'use client';

export type ProjectDinoVariant = 'sign-code' | 'headphones' | 'sign-api';

/**
 * Pequeños dinosaurios distintos para la esquina de cada tarjeta de proyecto:
 * - 'sign-code': sostiene un cartel de código </>
 * - 'headphones': lleva audífonos morados escuchando música mientras compila
 * - 'sign-api': sostiene un cartel { } de API REST
 */
export default function ProjectCornerDino({
  variant,
  className = 'h-16 w-16',
}: {
  variant: ProjectDinoVariant;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 88 80"
      className={className}
      aria-hidden
    >
      {/* Cola */}
      <path
        d="M18 58 Q6 54 9 44 Q16 50 24 49 Z"
        fill="#10B981"
        stroke="#18181B"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Cuerpo */}
      <ellipse cx="38" cy="56" rx="19" ry="15" fill="#10B981" stroke="#18181B" strokeWidth="2.2" />
      <ellipse cx="40" cy="60" rx="12" ry="9" fill="#D1FAE5" />
      {/* Patas */}
      <ellipse cx="30" cy="70" rx="7.5" ry="4.5" fill="#059669" stroke="#18181B" strokeWidth="2" />
      <ellipse cx="47" cy="70" rx="7.5" ry="4.5" fill="#059669" stroke="#18181B" strokeWidth="2" />

      {/* Placas moradas */}
      {[[27, 41], [37, 38], [46, 41]].map(([cx, cy]) => (
        <path
          key={cx}
          d={`M${cx - 5} ${cy + 5} Q${cx} ${cy - 6} ${cx + 5} ${cy + 5} Z`}
          fill="#7C3AED"
          stroke="#18181B"
          strokeWidth="1.8"
        />
      ))}

      {/* Cabeza */}
      <circle cx="39" cy="31" r="16" fill="#10B981" stroke="#18181B" strokeWidth="2.2" />
      <ellipse cx="48" cy="35" rx="8" ry="6" fill="#A7F3D0" />
      {/* Ojos */}
      <circle cx="35" cy="28" r="3.4" fill="#18181B" />
      <circle cx="46" cy="28" r="3.4" fill="#18181B" />
      <circle cx="36.2" cy="26.8" r="1.2" fill="#FFFFFF" />
      <circle cx="47.2" cy="26.8" r="1.2" fill="#FFFFFF" />
      {/* Sonrisa */}
      <path d="M38 36 q4 3.5 8 0" stroke="#18181B" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Variante con audífonos */}
      {variant === 'headphones' && (
        <g>
          <path d="M22 27 Q39 7 56 27" stroke="#5B21B6" strokeWidth="4.2" fill="none" strokeLinecap="round" />
          <rect x="18" y="23" width="7" height="13" rx="3.5" fill="#7C3AED" stroke="#18181B" strokeWidth="1.8" />
          <rect x="53" y="23" width="7" height="13" rx="3.5" fill="#7C3AED" stroke="#18181B" strokeWidth="1.8" />
          {/* Nota musical */}
          <text x="64" y="18" fontSize="12" fontWeight="700" fill="#7C3AED">♪</text>
        </g>
      )}

      {/* Variante con cartel de código </> */}
      {variant === 'sign-code' && (
        <g transform="translate(52, 26) rotate(6)">
          <line x1="12" y1="22" x2="12" y2="44" stroke="#18181B" strokeWidth="2.4" strokeLinecap="round" />
          <rect x="0" y="0" width="32" height="22" rx="5" fill="#FFFFFF" stroke="#5B21B6" strokeWidth="2.2" />
          <text
            x="16"
            y="14.5"
            textAnchor="middle"
            fontFamily="var(--font-mono), monospace"
            fontSize="10"
            fontWeight="700"
            fill="#5B21B6"
          >
            {'</>'}
          </text>
        </g>
      )}

      {/* Variante con cartel de API { } */}
      {variant === 'sign-api' && (
        <g transform="translate(52, 26) rotate(-5)">
          <line x1="12" y1="22" x2="12" y2="44" stroke="#18181B" strokeWidth="2.4" strokeLinecap="round" />
          <rect x="0" y="0" width="32" height="22" rx="5" fill="#7C3AED" stroke="#18181B" strokeWidth="2.2" />
          <text
            x="16"
            y="14.5"
            textAnchor="middle"
            fontFamily="var(--font-mono), monospace"
            fontSize="10"
            fontWeight="700"
            fill="#FFFFFF"
          >
            {'{ }'}
          </text>
        </g>
      )}
    </svg>
  );
}
