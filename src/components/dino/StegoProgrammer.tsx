'use client';

/**
 * Stegosaurus programador: audífonos, laptop diminuta y partículas de
 * código que salen de la pantalla (clase .code-particle de globals.css).
 * Las partículas se reposicionan con delay escalonado para un flujo continuo.
 */

const PARTICLES = [
  { text: '</>', left: '58%', delay: '0s' },
  { text: '{}', left: '68%', delay: '0.7s' },
  { text: 'def', left: '62%', delay: '1.3s' },
  { text: '01', left: '74%', delay: '1.9s' },
  { text: '=>', left: '56%', delay: '2.3s' },
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
            style={{ left: p.left, bottom: '34%', animationDelay: p.delay }}
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
          <linearGradient id="stego-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7FBF9A" />
            <stop offset="100%" stopColor="#3E8E6A" />
          </linearGradient>
        </defs>

        {/* ---------- Cola ---------- */}
        <path
          d="M78 132 Q28 128 14 104 Q44 118 84 112 Z"
          fill="url(#stego-body)"
        />

        {/* ---------- Placas dorsales (doradas) ---------- */}
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
            fill="#C4A35A"
            stroke="#9A7C36"
            strokeWidth="2"
          />
        ))}

        {/* ---------- Patas ---------- */}
        <rect x="88" y="150" width="26" height="42" rx="11" fill="#2F6E52" />
        <rect x="124" y="154" width="24" height="38" rx="10" fill="#3E8E6A" />
        <rect x="170" y="150" width="26" height="42" rx="11" fill="#2F6E52" />
        <rect x="204" y="154" width="24" height="38" rx="10" fill="#3E8E6A" />
        {[92, 104, 174, 186, 208, 218].map((x) => (
          <rect key={x} x={x} y="186" width="8" height="7" rx="3" fill="#E8E2F5" />
        ))}

        {/* ---------- Cuerpo ---------- */}
        <ellipse cx="146" cy="130" rx="86" ry="46" fill="url(#stego-body)" />
        {/* Vientre */}
        <ellipse cx="150" cy="152" rx="66" ry="26" fill="#A8D9BE" opacity="0.85" />
        {/* Manchas */}
        {[
          [116, 116, 12],
          [150, 108, 10],
          [184, 118, 11],
        ].map(([cx, cy, r]) => (
          <ellipse key={`${cx}`} cx={cx} cy={cy} rx={r} ry={r * 0.7} fill="#2F6E52" opacity="0.5" />
        ))}

        {/* ---------- Cabeza bajada hacia la laptop ---------- */}
        <g>
          <ellipse cx="244" cy="122" rx="34" ry="26" fill="url(#stego-body)" />
          {/* Hocico */}
          <ellipse cx="272" cy="130" rx="16" ry="12" fill="#A8D9BE" />
          <ellipse cx="280" cy="127" rx="3" ry="2.5" fill="#1F4D3A" />

          {/* Ojo (parpadea) */}
          <g
            className="animate-blink"
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          >
            <circle cx="250" cy="114" r="7.5" fill="#FFFFFF" />
            <circle cx="252" cy="115" r="3.8" fill="#16324A" />
            <circle cx="253.5" cy="113.5" r="1.4" fill="#FFFFFF" />
          </g>
          {/* Sonrisa concentrada */}
          <path
            d="M266 138 q6 4 11 0"
            stroke="#1F4D3A"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />

          {/* ---------- Audífonos ---------- */}
          {/* Arco */}
          <path
            d="M214 106 Q244 74 276 102"
            stroke="#1F1433"
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M214 106 Q244 74 276 102"
            stroke="#A98FD6"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Auricular */}
          <rect x="206" y="102" width="17" height="26" rx="8" fill="#1F1433" />
          <rect x="209" y="107" width="11" height="16" rx="5" fill="#6A4DAB" />
        </g>

        {/* ---------- Brazo corto ---------- */}
        <path
          d="M204 148 q16 6 26 2"
          stroke="#2F6E52"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />

        {/* ---------- Laptop ---------- */}
        <g>
          {/* Base */}
          <path d="M214 176 h68 l10 12 h-84 Z" fill="#2E2148" />
          <rect x="216" y="172" width="66" height="7" rx="2" fill="#4A3890" />
          {/* Pantalla */}
          <rect x="228" y="122" width="54" height="52" rx="4" fill="#120D1D" stroke="#6A4DAB" strokeWidth="3" />
          {/* Líneas de código */}
          <g className="animate-screen-flicker" style={{ transformBox: 'fill-box' }}>
            <rect x="234" y="130" width="30" height="4" rx="2" fill="#A98FD6" />
            <rect x="234" y="139" width="40" height="4" rx="2" fill="#C4A35A" />
            <rect x="238" y="148" width="24" height="4" rx="2" fill="#7FBF9A" />
            <rect x="238" y="157" width="34" height="4" rx="2" fill="#A98FD6" />
            <rect x="234" y="166" width="18" height="4" rx="2" fill="#C4A35A" />
          </g>
          {/* Reflejo */}
          <path d="M232 126 l16 0 -10 44 -10 0 Z" fill="#FFFFFF" opacity="0.06" />
        </g>
      </svg>
    </div>
  );
}
