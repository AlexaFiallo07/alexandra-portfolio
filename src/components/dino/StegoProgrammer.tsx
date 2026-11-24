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
          <linearGradient id="stego-studio" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* Sombra suave */}
        <ellipse cx="164" cy="194" rx="115" ry="9" fill="#5B21B6" opacity="0.1" />

        {/* Cola */}
        <path
          d="M78 132 Q28 128 14 104 Q44 118 84 112 Z"
          fill="url(#stego-studio)"
          stroke="#18181B"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Placas dorsales moradas */}
        {[
          [78, 74, 17],
          [106, 62, 20],
          [136, 58, 22],
          [166, 64, 19],
          [192, 76, 15],
        ].map(([cx, cy, r]) => (
          <path
            key={`${cx}`}
            d={`M${cx - r} ${cy + r * 0.7} Q${cx} ${cy - r} ${cx + r} ${cy + r * 0.7} Z`}
            fill="#7C3AED"
            stroke="#18181B"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        ))}

        {/* Patas */}
        <rect x="88" y="150" width="26" height="42" rx="11" fill="#059669" stroke="#18181B" strokeWidth="3" />
        <rect x="124" y="154" width="24" height="38" rx="10" fill="#10B981" stroke="#18181B" strokeWidth="3" />
        <rect x="170" y="150" width="26" height="42" rx="11" fill="#059669" stroke="#18181B" strokeWidth="3" />
        <rect x="204" y="154" width="24" height="38" rx="10" fill="#10B981" stroke="#18181B" strokeWidth="3" />
        {[92, 104, 174, 186, 208, 218].map((x) => (
          <rect key={x} x={x} y="186" width="8" height="7" rx="3" fill="#FFFFFF" stroke="#18181B" strokeWidth="1.5" />
        ))}

        {/* Cuerpo */}
        <ellipse cx="146" cy="130" rx="86" ry="46" fill="url(#stego-studio)" stroke="#18181B" strokeWidth="3.2" />
        <ellipse cx="150" cy="152" rx="66" ry="24" fill="#D1FAE5" />
        {[
          [116, 116, 11],
          [150, 108, 9],
          [184, 118, 10],
        ].map(([cx, cy, r]) => (
          <ellipse key={`${cx}`} cx={cx} cy={cy} rx={r} ry={r * 0.7} fill="#059669" opacity="0.35" />
        ))}

        {/* Cabeza */}
        <g>
          <ellipse cx="244" cy="122" rx="34" ry="26" fill="url(#stego-studio)" stroke="#18181B" strokeWidth="3.2" />
          <ellipse cx="272" cy="130" rx="16" ry="12" fill="#A7F3D0" stroke="#18181B" strokeWidth="2.4" />
          <ellipse cx="280" cy="127" rx="3" ry="2.5" fill="#18181B" />

          {/* Ojo */}
          <g className="animate-blink" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
            <circle cx="250" cy="114" r="7.5" fill="#FFFFFF" stroke="#18181B" strokeWidth="2" />
            <circle cx="252" cy="115" r="3.8" fill="#18181B" />
            <circle cx="253.5" cy="113.5" r="1.4" fill="#FFFFFF" />
          </g>
          <path d="M266 138 q6 4 11 0" stroke="#18181B" strokeWidth="2.4" strokeLinecap="round" fill="none" />

          {/* Audífonos morados */}
          <path d="M214 106 Q244 74 276 102" stroke="#18181B" strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M214 106 Q244 74 276 102" stroke="#7C3AED" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <rect x="206" y="102" width="17" height="26" rx="8" fill="#5B21B6" stroke="#18181B" strokeWidth="2.4" />
          <rect x="210" y="108" width="9" height="14" rx="4" fill="#10B981" />
        </g>

        {/* Brazo */}
        <path d="M204 148 q16 6 26 2" stroke="#18181B" strokeWidth="11" strokeLinecap="round" fill="none" />
        <path d="M204 148 q16 6 26 2" stroke="#10B981" strokeWidth="6" strokeLinecap="round" fill="none" />

        {/* Laptop luminosa */}
        <g>
          <path d="M214 176 h68 l10 12 h-84 Z" fill="#E8E8EE" stroke="#18181B" strokeWidth="2.4" strokeLinejoin="round" />
          <rect x="216" y="172" width="66" height="7" rx="2" fill="#D8D8E2" stroke="#18181B" strokeWidth="2" />
          <rect x="228" y="122" width="54" height="52" rx="5" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.8" />
          <g className="animate-screen-flicker" style={{ transformBox: 'fill-box' }}>
            <rect x="235" y="130" width="30" height="4" rx="2" fill="#7C3AED" />
            <rect x="235" y="139" width="40" height="4" rx="2" fill="#10B981" />
            <rect x="239" y="148" width="24" height="4" rx="2" fill="#5B21B6" />
            <rect x="239" y="157" width="34" height="4" rx="2" fill="#059669" />
            <rect x="235" y="166" width="18" height="4" rx="2" fill="#7C3AED" />
          </g>
        </g>
      </svg>
    </div>
  );
}
