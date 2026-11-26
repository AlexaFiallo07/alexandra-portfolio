'use client';

import SpinOnPress from '@/components/dino/SpinOnPress';

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
    <SpinOnPress
      className={className}
      label={`Girar dinosaurio de ${variant === 'headphones' ? 'audífonos' : variant === 'sign-api' ? 'API' : 'código'} 360°`}
    >
    <svg
      viewBox="0 0 88 80"
      className="h-full w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="corner-body" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#3E9D7B" />
          <stop offset="60%" stopColor="#3E9D7B" />
          <stop offset="100%" stopColor="#2B775D" />
        </linearGradient>
        <linearGradient id="corner-belly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E2F3EA" />
          <stop offset="100%" stopColor="#C9E7D9" />
        </linearGradient>
        <linearGradient id="corner-plate" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#6A4DAB" />
          <stop offset="100%" stopColor="#3A2370" />
        </linearGradient>
        <linearGradient id="corner-sign" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#EFEAF7" />
        </linearGradient>
        <pattern id="corner-scales" width="9" height="8" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="1.2" fill="#FFFFFF" opacity="0.22" />
        </pattern>
        <filter id="corner-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#3A2370" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Sombra de estudio */}
      <ellipse cx="38" cy="75" rx="22" ry="3" fill="#3A2370" opacity="0.1" />

      {/* Cola con relieve */}
      <path d="M20 58 Q6 55 9 44 Q9 41 12 42 Q15 51 26 50 Z" fill="url(#corner-body)" stroke="#1F1433" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M12 46 Q15 52 20 54" stroke="#E2F3EA" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7" />

      {/* Cuerpo, textura y vientre */}
      <g filter="url(#corner-shadow)">
        <ellipse cx="38" cy="56" rx="19" ry="15" fill="url(#corner-body)" stroke="#1F1433" strokeWidth="2.2" />
      </g>
      <ellipse cx="38" cy="56" rx="18" ry="14" fill="url(#corner-scales)" />
      <path d="M25 49 Q33 45 42 47" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.5" />
      <ellipse cx="40" cy="60" rx="12" ry="9" fill="url(#corner-belly)" stroke="#C9E7D9" strokeWidth="0.9" />
      <path d="M32 60 q8 2 16 0" stroke="#2B775D" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.35" />

      {/* Patas con dedos */}
      <ellipse cx="30" cy="70" rx="7.5" ry="4.5" fill="url(#corner-body)" stroke="#1F1433" strokeWidth="2" />
      <ellipse cx="47" cy="70" rx="7.5" ry="4.5" fill="url(#corner-body)" stroke="#1F1433" strokeWidth="2" />
      {[27, 32, 44, 49].map((x) => (
        <ellipse key={x} cx={x} cy="72" rx="2" ry="1.2" fill="#FFFFFF" stroke="#1F1433" strokeWidth="0.7" />
      ))}

      {/* Placas moradas con brillo */}
      {[[27, 41], [37, 38], [46, 41]].map(([cx, cy]) => (
        <g key={cx}>
          <path d={`M${cx - 5} ${cy + 5} Q${cx} ${cy - 6} ${cx + 5} ${cy + 5} Z`} fill="url(#corner-plate)" stroke="#1F1433" strokeWidth="1.8" strokeLinejoin="round" />
          <path d={`M${cx - 2} ${cy + 1.5} Q${cx} ${cy - 3} ${cx + 2} ${cy + 1.5}`} stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.55" />
        </g>
      ))}

      {/* Cabeza: hocico, cejas, ojos con doble brillo y sonrisa */}
      <g filter="url(#corner-shadow)">
        <circle cx="39" cy="31" r="16" fill="url(#corner-body)" stroke="#1F1433" strokeWidth="2.2" />
      </g>
      <path d="M29 22 Q37 17 46 20" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.55" />
      <ellipse cx="48" cy="35" rx="8" ry="6" fill="url(#corner-belly)" stroke="#C9E7D9" strokeWidth="0.9" />
      <ellipse cx="53" cy="33.5" rx="1.8" ry="1.3" fill="#1F1433" />
      <path d="M31 22 q2.5 -1.6 5 0" stroke="#1F1433" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <path d="M43 22 q2.5 -1 5 0.6" stroke="#1F1433" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <circle cx="35" cy="28" r="3.4" fill="#1F1433" />
      <circle cx="46" cy="28" r="3.4" fill="#1F1433" />
      <circle cx="36.2" cy="26.8" r="1.2" fill="#FFFFFF" />
      <circle cx="47.2" cy="26.8" r="1.2" fill="#FFFFFF" />
      <circle cx="33.9" cy="29.4" r="0.6" fill="#FFFFFF" opacity="0.85" />
      <circle cx="44.9" cy="29.4" r="0.6" fill="#FFFFFF" opacity="0.85" />
      <ellipse cx="30" cy="33" rx="3" ry="1.8" fill="#6A4DAB" opacity="0.26" />
      <ellipse cx="48" cy="34" rx="2.6" ry="1.6" fill="#6A4DAB" opacity="0.2" />
      <path d="M38 36 q4 3.5 8 0" stroke="#1F1433" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Variante con audífonos */}
      {variant === 'headphones' && (
        <g>
          <path d="M21 27 Q39 6 57 27" stroke="#1F1433" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M21 27 Q39 6 57 27" stroke="url(#corner-plate)" strokeWidth="3.6" fill="none" strokeLinecap="round" />
          <path d="M26 17 Q39 10 52 17" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.55" />
          <rect x="17" y="22" width="9" height="15" rx="4.5" fill="#3A2370" stroke="#1F1433" strokeWidth="1.8" />
          <rect x="20" y="25" width="4" height="9" rx="2" fill="#6A4DAB" />
          <rect x="52" y="22" width="9" height="15" rx="4.5" fill="#3A2370" stroke="#1F1433" strokeWidth="1.8" />
          <rect x="55" y="25" width="4" height="9" rx="2" fill="#6A4DAB" />
          {/* Nota musical con sombra */}
          <g transform="translate(63, 12) rotate(12)">
            <text x="1" y="10" fontSize="13" fontWeight="700" fill="#1F1433" opacity="0.18">♪</text>
            <text x="0" y="9" fontSize="13" fontWeight="700" fill="#6A4DAB">♪</text>
          </g>
        </g>
      )}

      {/* Variante con cartel de código </> */}
      {variant === 'sign-code' && (
        <g transform="translate(52, 26) rotate(6)">
          <line x1="12" y1="22" x2="12" y2="44" stroke="#1F1433" strokeWidth="2.6" strokeLinecap="round" />
          <line x1="12" y1="22" x2="12" y2="44" stroke="#E4DCF1" strokeWidth="1" strokeLinecap="round" />
          <rect x="0" y="0" width="32" height="22" rx="5" fill="url(#corner-sign)" stroke="#3A2370" strokeWidth="2.2" />
          <path d="M5 3 h10" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
          <text
            x="16"
            y="14.5"
            textAnchor="middle"
            fontFamily="var(--font-mono), monospace"
            fontSize="10"
            fontWeight="700"
            fill="#3A2370"
          >
            {'</>'}
          </text>
        </g>
      )}

      {/* Variante con cartel de API { } */}
      {variant === 'sign-api' && (
        <g transform="translate(52, 26) rotate(-5)">
          <line x1="12" y1="22" x2="12" y2="44" stroke="#1F1433" strokeWidth="2.6" strokeLinecap="round" />
          <line x1="12" y1="22" x2="12" y2="44" stroke="#E4DCF1" strokeWidth="1" strokeLinecap="round" />
          <rect x="0" y="0" width="32" height="22" rx="5" fill="url(#corner-plate)" stroke="#1F1433" strokeWidth="2.2" />
          <path d="M5 3 h10" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" opacity="0.45" />
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
    </SpinOnPress>
  );
}
