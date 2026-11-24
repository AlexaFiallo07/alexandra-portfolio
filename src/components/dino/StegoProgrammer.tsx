'use client';

/**
 * Stegosaurus programador (Studio Light):
 * Verde esmeralda con placas dorsales moradas, audífonos #5B21B6,
 * portátil luminoso y partículas de código flotando.
 */

const PARTICLES = [
  { text: '</>', left: '58%', delay: '0s' },
  { text: '{ }', left: '69%', delay: '0.7s' },
  { text: 'def', left: '62%', delay: '1.3s' },
  { text: '200', left: '75%', delay: '1.9s' },
  { text: '=>', left: '55%', delay: '2.3s' },
];

export default function StegoProgrammer({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Partículas de código flotando sobre la laptop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
        {PARTICLES.map((p) => (
          <span
            key={p.text}
            className="code-particle"
            style={{ left: p.left, bottom: '36%', animationDelay: p.delay }}
          >
            {p.text}
          </span>
        ))}
      </div>

      <svg
        viewBox="0 0 300 210"
        className="w-full"
        role="img"
        aria-label="Stegosaurus con audífonos programando en una laptop"
      >
        <defs>
          <linearGradient id="stego-body" x1="0" y1="0" x2="0.15" y2="1">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="55%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="stego-belly" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D1FAE5" />
            <stop offset="100%" stopColor="#A7F3D0" />
          </linearGradient>
          <linearGradient id="stego-plate" x1="0" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#5B21B6" />
          </linearGradient>
          <linearGradient id="stego-screen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E8E8EE" />
          </linearGradient>
          <pattern id="stego-scales" width="14" height="12" patternUnits="userSpaceOnUse">
            <circle cx="3.5" cy="3.5" r="1.8" fill="#FFFFFF" opacity="0.22" />
            <circle cx="10" cy="9" r="1.3" fill="#059669" opacity="0.12" />
          </pattern>
          <filter id="stego-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#5B21B6" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Sombra suave de estudio */}
        <ellipse cx="164" cy="194" rx="115" ry="9" fill="#5B21B6" opacity="0.1" />
        <ellipse cx="164" cy="194" rx="78" ry="5" fill="#5B21B6" opacity="0.08" />

        {/* Cola con relieve */}
        <path
          d="M82 112 Q36 130 12 102 Q10 96 16 94 Q46 116 86 104 Z"
          fill="url(#stego-body)"
          stroke="#18181B"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path d="M24 103 Q48 118 72 112" stroke="#D1FAE5" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.65" />

        {/* Placas dorsales moradas: degradado + brillo */}
        {[
          [78, 74, 17],
          [106, 62, 20],
          [136, 58, 22],
          [166, 64, 19],
          [192, 76, 15],
        ].map(([cx, cy, r]) => (
          <g key={`${cx}`}>
            <path
              d={`M${cx - r} ${cy + r * 0.7} Q${cx} ${cy - r} ${cx + r} ${cy + r * 0.7} Z`}
              fill="url(#stego-plate)"
              stroke="#18181B"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path
              d={`M${cx - r * 0.4} ${cy + r * 0.2} Q${cx} ${cy - r * 0.55} ${cx + r * 0.4} ${cy + r * 0.2}`}
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.5"
            />
          </g>
        ))}

        {/* Patas con pliegues y uñas */}
        <g filter="url(#stego-shadow)">
          <rect x="88" y="150" width="26" height="42" rx="11" fill="url(#stego-body)" stroke="#18181B" strokeWidth="3" />
          <rect x="124" y="154" width="24" height="38" rx="10" fill="url(#stego-body)" stroke="#18181B" strokeWidth="3" />
          <rect x="170" y="150" width="26" height="42" rx="11" fill="url(#stego-body)" stroke="#18181B" strokeWidth="3" />
          <rect x="204" y="154" width="24" height="38" rx="10" fill="url(#stego-body)" stroke="#18181B" strokeWidth="3" />
        </g>
        {[100, 135, 182, 215].map((x) => (
          <path key={x} d={`M${x - 6} 166 q6 3 12 0`} stroke="#D1FAE5" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
        ))}
        {[92, 104, 174, 186, 208, 218].map((x) => (
          <rect key={x} x={x} y="186" width="8" height="7" rx="3" fill="#FFFFFF" stroke="#18181B" strokeWidth="1.5" />
        ))}

        {/* Cuerpo, textura y vientre */}
        <g filter="url(#stego-shadow)">
          <ellipse cx="146" cy="130" rx="86" ry="46" fill="url(#stego-body)" stroke="#18181B" strokeWidth="3.2" />
        </g>
        <ellipse cx="146" cy="130" rx="84" ry="44" fill="url(#stego-scales)" />
        <path d="M82 116 Q112 92 156 94" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.5" />
        <ellipse cx="150" cy="152" rx="66" ry="24" fill="url(#stego-belly)" stroke="#A7F3D0" strokeWidth="1.2" />
        {[146, 156].map((y) => (
          <path key={y} d={`M104 ${y} q46 6 92 0`} stroke="#059669" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.3" />
        ))}
        {[
          [116, 116, 11],
          [150, 108, 9],
          [184, 118, 10],
        ].map(([cx, cy, r]) => (
          <g key={`${cx}`}>
            <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.7} fill="#059669" opacity="0.28" />
            <ellipse cx={cx - 2} cy={cy - 2} rx={r * 0.35} ry={r * 0.18} fill="#FFFFFF" opacity="0.3" />
          </g>
        ))}

        {/* Cabeza: hocico, ojo, ceja, rubor y sonrisa */}
        <g>
          <g filter="url(#stego-shadow)">
            <ellipse cx="244" cy="122" rx="34" ry="26" fill="url(#stego-body)" stroke="#18181B" strokeWidth="3.2" />
          </g>
          <path d="M226 104 Q244 96 262 104" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.55" />
          <ellipse cx="272" cy="130" rx="16" ry="12" fill="url(#stego-belly)" stroke="#18181B" strokeWidth="2.4" />
          <ellipse cx="280" cy="127" rx="3" ry="2.5" fill="#18181B" />
          <ellipse cx="279" cy="126.2" rx="0.9" ry="0.7" fill="#FFFFFF" opacity="0.9" />
          <path d="M242 130 q10 7 20 1" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.45" />
          <path d="M245 100 q6 -4 12 0" stroke="#18181B" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <g className="animate-blink" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
            <circle cx="250" cy="114" r="7.5" fill="#FFFFFF" stroke="#18181B" strokeWidth="2" />
            <circle cx="252" cy="115" r="3.8" fill="#18181B" />
            <circle cx="253.5" cy="113.5" r="1.4" fill="#FFFFFF" />
            <circle cx="250.8" cy="117" r="0.7" fill="#FFFFFF" opacity="0.85" />
          </g>
          <ellipse cx="238" cy="126" rx="5.5" ry="3.2" fill="#7C3AED" opacity="0.24" />
          <path d="M264 138 q6 4 11 0" stroke="#18181B" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <ellipse cx="222" cy="118" rx="4.5" ry="6" fill="#059669" stroke="#18181B" strokeWidth="1.6" />
          <ellipse cx="222" cy="118" rx="2" ry="3" fill="#D1FAE5" opacity="0.8" />

          {/* Audífonos: arco doble, almohadillas y costura */}
          <path d="M212 106 Q244 70 278 102" stroke="#18181B" strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M212 106 Q244 70 278 102" stroke="url(#stego-plate)" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M222 88 Q244 76 266 88" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.5" />
          <rect x="204" y="101" width="19" height="28" rx="9" fill="#5B21B6" stroke="#18181B" strokeWidth="2.4" />
          <rect x="208" y="106" width="11" height="18" rx="5.5" fill="#7C3AED" />
          <rect x="211" y="109" width="5" height="12" rx="2.5" fill="#10B981" opacity="0.9" />
          <rect x="268" y="99" width="17" height="26" rx="8" fill="#5B21B6" stroke="#18181B" strokeWidth="2.4" />
          <rect x="272" y="104" width="9" height="16" rx="4.5" fill="#7C3AED" />
          <path d="M272 112 q5 3 9 0" stroke="#D1FAE5" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7" />
        </g>

        {/* Brazo y manita tecleando */}
        <path d="M202 148 q18 8 30 2" stroke="#18181B" strokeWidth="12" strokeLinecap="round" fill="none" />
        <path d="M202 148 q18 8 30 2" stroke="url(#stego-body)" strokeWidth="7" strokeLinecap="round" fill="none" />
        <ellipse cx="232" cy="151" rx="7" ry="5.5" fill="#10B981" stroke="#18181B" strokeWidth="1.8" />
        {[229, 233].map((x) => (
          <path key={x} d={`M${x} 154 l1 3`} stroke="#D1FAE5" strokeWidth="1.4" strokeLinecap="round" />
        ))}

        {/* Laptop luminosa con reflejo y teclado */}
        <g>
          <path d="M212 176 h70 l10 12 h-86 Z" fill="url(#stego-screen)" stroke="#18181B" strokeWidth="2.4" strokeLinejoin="round" />
          <rect x="216" y="172" width="66" height="7" rx="2" fill="#D8D8E2" stroke="#18181B" strokeWidth="2" />
          {[224, 236, 248, 260, 272].map((x) => (
            <path key={x} d={`M${x} 180 h5`} stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" opacity="0.9" />
          ))}
          <rect x="226" y="121" width="56" height="54" rx="6" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.8" />
          <rect x="231" y="126" width="46" height="44" rx="3" fill="url(#stego-screen)" stroke="#7C3AED" strokeWidth="1.6" />
          <path d="M234 127 L248 127 L234 145 Z" fill="#FFFFFF" opacity="0.55" />
          <g className="animate-screen-flicker" style={{ transformBox: 'fill-box' }}>
            <rect x="235" y="130" width="30" height="4" rx="2" fill="#7C3AED" />
            <rect x="235" y="139" width="40" height="4" rx="2" fill="#10B981" />
            <rect x="239" y="148" width="24" height="4" rx="2" fill="#5B21B6" />
            <rect x="239" y="157" width="34" height="4" rx="2" fill="#059669" />
            <rect x="235" y="166" width="18" height="4" rx="2" fill="#7C3AED" />
          </g>
          <g transform="translate(263, 164) rotate(-12)">
            <circle cx="5" cy="5" r="4.5" fill="#10B981" stroke="#18181B" strokeWidth="1.2" />
            <circle cx="3.5" cy="3.5" r="1" fill="#FFFFFF" />
          </g>
        </g>
      </svg>
    </div>
  );
}
