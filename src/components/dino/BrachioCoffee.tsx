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
        <linearGradient id="brachio-green" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="brachio-mint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D1FAE5" />
          <stop offset="100%" stopColor="#A7F3D0" />
        </linearGradient>
      </defs>

      <g className="animate-float-soft">
        {/* Cola */}
        <g className="animate-tail-wag" style={{ transformBox: 'fill-box', transformOrigin: 'right center' }}>
          <path
            d="M60 268 Q10 258 18 224 Q40 246 76 244 Z"
            fill="url(#brachio-green)"
            stroke="#18181B"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        </g>

        {/* Patas */}
        <rect x="74" y="272" width="34" height="56" rx="14" fill="#059669" stroke="#18181B" strokeWidth="3.5" />
        <rect x="120" y="276" width="32" height="52" rx="13" fill="#10B981" stroke="#18181B" strokeWidth="3.5" />
        <rect x="196" y="270" width="36" height="58" rx="14" fill="#059669" stroke="#18181B" strokeWidth="3.5" />
        <rect x="242" y="274" width="32" height="54" rx="13" fill="#10B981" stroke="#18181B" strokeWidth="3.5" />

        {/* Uñas */}
        {[80, 94, 202, 216, 248, 260].map((x) => (
          <rect key={x} x={x} y="320" width="8" height="7" rx="3" fill="#FFFFFF" stroke="#18181B" strokeWidth="1.8" />
        ))}

        {/* Cuerpo y vientre */}
        <ellipse cx="168" cy="248" rx="102" ry="62" fill="url(#brachio-green)" stroke="#18181B" strokeWidth="3.5" />
        <ellipse cx="170" cy="264" rx="82" ry="44" fill="url(#brachio-mint)" />

        {/* Manchas moradas divertidas */}
        {[
          [116, 214, 14],
          [154, 206, 12],
          [192, 214, 14],
        ].map(([cx, cy, r]) => (
          <ellipse key={`${cx}`} cx={cx} cy={cy} rx={r} ry={r * 0.72} fill="#7C3AED" opacity="0.28" />
        ))}

        {/* Placas dorsales moradas */}
        {[[126, 192], [160, 184], [196, 190]].map(([cx, cy]) => (
          <path
            key={`${cx}`}
            d={`M${cx - 9} ${cy + 8} Q${cx} ${cy - 12} ${cx + 9} ${cy + 8} Z`}
            fill="#7C3AED"
            stroke="#18181B"
            strokeWidth="2.4"
          />
        ))}

        {/* Cuello largo */}
        <path
          d="M226 232
             C 262 208, 268 150, 256 104
             C 248 72, 232 54, 214 46
             L 176 62
             C 196 78, 210 100, 216 132
             C 224 174, 214 210, 190 232 Z"
          fill="url(#brachio-green)"
          stroke="#18181B"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Cabeza */}
        <g>
          <ellipse cx="184" cy="44" rx="46" ry="34" fill="url(#brachio-green)" stroke="#18181B" strokeWidth="3.5" />
          <ellipse cx="148" cy="52" rx="25" ry="18" fill="#A7F3D0" stroke="#18181B" strokeWidth="2.8" />
          <ellipse cx="136" cy="46" rx="3.5" ry="2.5" fill="#18181B" />

          {/* Ojo que parpadea */}
          <g className="animate-blink" style={eyeStyle}>
            <circle cx="196" cy="36" r="10.5" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.4" />
            <circle cx="198" cy="37" r="5" fill="#18181B" />
            <circle cx="200" cy="35" r="1.8" fill="#FFFFFF" />
          </g>
          <path d="M186 19 Q197 13 208 19" stroke="#18181B" strokeWidth="3" strokeLinecap="round" fill="none" />
          <ellipse cx="186" cy="52" rx="6" ry="3.5" fill="#7C3AED" opacity="0.25" />

          {/* Sonrisa */}
          <path d="M134 58 Q144 66 156 60" stroke="#18181B" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        </g>

        {/* Brazo sosteniendo la taza */}
        <path
          d="M214 236 C 238 226, 246 200, 232 186 L 214 196 C 224 206, 220 220, 202 226 Z"
          fill="#10B981"
          stroke="#18181B"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />

        {/* Taza de café de código */}
        <g>
          <path
            d="M148 158 q22 -4 22 14 q0 18 -22 14"
            stroke="#5B21B6"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          <rect x="104" y="150" width="48" height="52" rx="8" fill="#FFFFFF" stroke="#18181B" strokeWidth="3" />
          <rect x="104" y="150" width="48" height="11" rx="4" fill="#7C3AED" stroke="#18181B" strokeWidth="2.5" />
          <text
            x="128"
            y="188"
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
