'use client';

/**
 * Brachiosaurus 2D (caricatura chistosa) asomándose desde el borde de la tarjeta,
 * tomando café en su taza "</>". Colores vibrantes verde esmeralda (#10B981/#059669)
 * con detalles morados (#7C3AED/#5B21B6) y trazo limpio de estudio (#18181B).
 */
export default function BrachioCoffee({ className = '' }: { className?: string }) {
  const eyeStyle: React.CSSProperties = {
    transformBox: 'fill-box',
    transformOrigin: 'center',
  };

  return (
    <svg
      viewBox="0 0 340 360"
      className={className}
      role="img"
      aria-label="Brachiosaurus tomando café de código"
    >
      <defs>
        <linearGradient id="brachio-body" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="52%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="brachio-belly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D1FAE5" />
          <stop offset="55%" stopColor="#D1FAE5" />
          <stop offset="100%" stopColor="#A7F3D0" />
        </linearGradient>
        <linearGradient id="brachio-plate" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>
        <linearGradient id="brachio-mug" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E8E8EE" />
        </linearGradient>
        <pattern id="brachio-scales" width="16" height="14" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="2.1" fill="#FFFFFF" opacity="0.24" />
          <circle cx="12" cy="10" r="1.6" fill="#059669" opacity="0.12" />
        </pattern>
        <filter id="brachio-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#5B21B6" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Sombra de estudio en el suelo */}
      <ellipse cx="164" cy="334" rx="104" ry="10" fill="#5B21B6" opacity="0.12" />

      <g className="animate-float-soft">
        {/* Cola con relieve y pliegues */}
        <g
          className="animate-tail-wag"
          style={{ transformBox: 'fill-box', transformOrigin: 'right center' }}
        >
          <path
            d="M76 246 Q34 260 16 222 Q12 210 20 204 Q32 236 78 234 Z"
            fill="url(#brachio-body)"
            stroke="#18181B"
            strokeWidth="3.4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path d="M28 218 Q40 238 66 242" stroke="#D1FAE5" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.7" />
          <path d="M36 226 q5 6 2 12 M52 234 q5 5 2 11" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.6" />
        </g>

        {/* Patas: volumen, pliegues y uñas */}
        <g filter="url(#brachio-shadow)">
          <rect x="74" y="272" width="34" height="56" rx="15" fill="url(#brachio-body)" stroke="#18181B" strokeWidth="3.4" />
          <rect x="120" y="276" width="32" height="52" rx="14" fill="url(#brachio-body)" stroke="#18181B" strokeWidth="3.4" />
          <rect x="196" y="270" width="36" height="58" rx="16" fill="url(#brachio-body)" stroke="#18181B" strokeWidth="3.4" />
          <rect x="242" y="274" width="32" height="54" rx="14" fill="url(#brachio-body)" stroke="#18181B" strokeWidth="3.4" />
        </g>
        {[88, 134, 212, 256].map((x) => (
          <path key={x} d={`M${x - 7} 291 q7 4 14 0`} stroke="#D1FAE5" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.65" />
        ))}
        {[80, 94, 202, 216, 248, 260].map((x) => (
          <g key={x}>
            <rect x={x} y="320" width="8" height="7" rx="3.5" fill="#FFFFFF" stroke="#18181B" strokeWidth="1.6" />
            <path d={`M${x + 2} 322 h3`} stroke="#D8D8E2" strokeWidth="1" strokeLinecap="round" />
          </g>
        ))}

        {/* Cuerpo y vientre con textura de escamas */}
        <g filter="url(#brachio-shadow)">
          <ellipse cx="168" cy="248" rx="102" ry="62" fill="url(#brachio-body)" stroke="#18181B" strokeWidth="3.5" />
        </g>
        <ellipse cx="168" cy="248" rx="100" ry="60" fill="url(#brachio-scales)" />
        <path d="M86 224 Q130 190 188 196" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5" />
        <ellipse cx="170" cy="264" rx="82" ry="44" fill="url(#brachio-belly)" stroke="#A7F3D0" strokeWidth="1.6" />
        {[250, 266, 282].map((y) => (
          <path key={y} d={`M112 ${y} q58 9 116 0`} stroke="#059669" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.32" />
        ))}

        {/* Manchas moradas divertidas */}
        {[
          [116, 214, 14],
          [154, 206, 12],
          [192, 214, 14],
        ].map(([cx, cy, r]) => (
          <g key={`${cx}`}>
            <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.72} fill="url(#brachio-plate)" opacity="0.3" />
            <ellipse cx={cx - r * 0.25} cy={cy - r * 0.2} rx={r * 0.4} ry={r * 0.2} fill="#FFFFFF" opacity="0.28" />
          </g>
        ))}

        {/* Placas dorsales moradas con brillo */}
        {[[126, 192], [160, 184], [196, 190]].map(([cx, cy]) => (
          <g key={`${cx}`}>
            <path
              d={`M${cx - 10} ${cy + 9} Q${cx} ${cy - 14} ${cx + 10} ${cy + 9} Z`}
              fill="url(#brachio-plate)"
              stroke="#18181B"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <path d={`M${cx - 4} ${cy + 3} Q${cx} ${cy - 6} ${cx + 4} ${cy + 3}`} stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
          </g>
        ))}

        {/* Cuello largo con relieve y cresta */}
        <path
          d="M226 232
             C 262 208, 268 150, 256 104
             C 248 72, 232 54, 214 46
             L 176 62
             C 196 78, 210 100, 216 132
             C 224 174, 214 210, 190 232 Z"
          fill="url(#brachio-body)"
          stroke="#18181B"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path d="M224 218 C250 190 254 138 244 100 C238 78 228 62 216 54" stroke="#D1FAE5" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
        {[
          [248, 144], [250, 116], [240, 88],
        ].map(([cx, cy]) => (
          <path
            key={`${cx}-${cy}`}
            d={`M${cx + 4} ${cy + 7} l8 -8 l1 11 Z`}
            fill="url(#brachio-plate)"
            stroke="#18181B"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        ))}

        {/* Cabeza: cráneo, hocico, párpado, mirada y sonrisa */}
        <g>
          <g filter="url(#brachio-shadow)">
            <ellipse cx="184" cy="44" rx="46" ry="34" fill="url(#brachio-body)" stroke="#18181B" strokeWidth="3.5" />
          </g>
          <path d="M158 24 Q182 10 206 20" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" fill="none" opacity="0.55" />
          {/* Orejita / abertura auditiva */}
          <ellipse cx="212" cy="50" rx="6" ry="8" fill="#059669" stroke="#18181B" strokeWidth="1.8" />
          <ellipse cx="212" cy="50" rx="2.6" ry="4" fill="#D1FAE5" opacity="0.8" />
          {/* Hocico */}
          <ellipse cx="146" cy="52" rx="25" ry="18" fill="url(#brachio-belly)" stroke="#18181B" strokeWidth="2.8" />
          <ellipse cx="137" cy="45" rx="3.4" ry="2.4" fill="#18181B" />
          <ellipse cx="135.6" cy="44.2" rx="1" ry="0.7" fill="#FFFFFF" opacity="0.9" />
          <path d="M128 56 Q140 62 154 58" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.5" />
          {/* Ceja y párpado */}
          <path d="M184 17 Q196 10 209 17" stroke="#18181B" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Ojo que parpadea */}
          <g className="animate-blink" style={eyeStyle}>
            <circle cx="196" cy="36" r="10.5" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.4" />
            <circle cx="198" cy="37" r="5" fill="#18181B" />
            <circle cx="200" cy="35" r="1.8" fill="#FFFFFF" />
            <circle cx="195.7" cy="39.4" r="0.9" fill="#FFFFFF" opacity="0.9" />
          </g>
          <path d="M186 24 Q196 20 206 24" stroke="#5B21B6" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.55" />
          {/* Rubor y sonrisa con lengüita */}
          <ellipse cx="172" cy="53" rx="7" ry="4" fill="#7C3AED" opacity="0.26" />
          <path d="M134 58 Q144 67 157 60" stroke="#18181B" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          <path d="M143 64 q4 4 8 -1" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
        </g>

        {/* Brazo sosteniendo la taza */}
        <path
          d="M214 236 C 238 226, 246 200, 232 186 L 214 196 C 224 206, 220 220, 202 226 Z"
          fill="url(#brachio-body)"
          stroke="#18181B"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
        <path d="M219 228 q14 -10 17 -26" stroke="#D1FAE5" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
        <ellipse cx="224" cy="190" rx="9" ry="7" fill="#10B981" stroke="#18181B" strokeWidth="2" />
        <path d="M220 188 q4 3 8 0" stroke="#D1FAE5" strokeWidth="1.4" strokeLinecap="round" fill="none" />

        {/* Taza de café de código */}
        <g>
          <path
            d="M148 158 q24 -4 24 14 q0 18 -24 14"
            stroke="#18181B"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M148 158 q24 -4 24 14 q0 18 -24 14"
            stroke="#5B21B6"
            strokeWidth="5.5"
            fill="none"
            strokeLinecap="round"
          />
          <rect x="104" y="150" width="48" height="52" rx="9" fill="url(#brachio-mug)" stroke="#18181B" strokeWidth="3" />
          <rect x="104" y="150" width="48" height="11" rx="5" fill="url(#brachio-plate)" stroke="#18181B" strokeWidth="2.5" />
          <path d="M110 168 v25" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" opacity="0.85" />
          <rect x="112" y="156" width="32" height="3" rx="1.5" fill="#5B21B6" opacity="0.4" />
          <text
            x="128"
            y="189"
            textAnchor="middle"
            fontFamily="var(--font-mono), monospace"
            fontSize="13"
            fontWeight="700"
            fill="#5B21B6"
          >
            {'</>'}
          </text>
        </g>

        {/* Vapor */}
        <g stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" fill="none">
          <path className="animate-steam" d="M116 140 q-6 -10 0 -20 q6 -10 0 -18" style={{ animationDelay: '0s' }} />
          <path className="animate-steam" d="M130 136 q6 -10 0 -20 q-6 -10 0 -16" style={{ animationDelay: '0.9s' }} />
          <path className="animate-steam" d="M142 140 q-5 -9 0 -16" style={{ animationDelay: '1.7s' }} />
        </g>
      </g>
    </svg>
  );
}
