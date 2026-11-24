'use client';

/**
 * Brachiosaurus 2D (estilo caricatura tierna) asomándose desde un lado,
 * tomando café de código en una taza "</>". Animaciones CSS:
 * - flotación suave del cuerpo
 * - parpadeo de ojos
 * - vapor de la taza
 * - balanceo de cola
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
        <linearGradient id="brachio-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A98FD6" />
          <stop offset="100%" stopColor="#6A4DAB" />
        </linearGradient>
        <linearGradient id="brachio-belly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D9CFF0" />
          <stop offset="100%" stopColor="#B7A8E0" />
        </linearGradient>
      </defs>

      {/* ---------- Cuerpo completo (flota suave) ---------- */}
      <g className="animate-float-soft">
        {/* Cola (balancea) */}
        <g className="animate-tail-wag" style={{ transformBox: 'fill-box', transformOrigin: 'right center' }}>
          <path
            d="M60 268 Q6 258 14 224 Q36 246 74 244 Z"
            fill="url(#brachio-body)"
          />
        </g>

        {/* Patas traseras */}
        <rect x="74" y="272" width="34" height="56" rx="14" fill="#5A43A0" />
        <rect x="120" y="276" width="32" height="52" rx="13" fill="#6A4DAB" />
        {/* Patas delanteras */}
        <rect x="196" y="270" width="36" height="58" rx="14" fill="#5A43A0" />
        <rect x="242" y="274" width="32" height="54" rx="13" fill="#6A4DAB" />
        {/* Uñas */}
        {[80, 94, 202, 216, 248, 260].map((x) => (
          <rect key={x} x={x} y="320" width="8" height="7" rx="3" fill="#E8E2F5" />
        ))}

        {/* Vientre */}
        <ellipse cx="170" cy="262" rx="92" ry="52" fill="url(#brachio-belly)" />
        {/* Cuerpo */}
        <ellipse cx="168" cy="248" rx="102" ry="62" fill="url(#brachio-body)" />

        {/* Manchas del lomo */}
        {[
          [120, 214, 16],
          [156, 206, 13],
          [192, 212, 15],
          [226, 226, 11],
        ].map(([cx, cy, r]) => (
          <ellipse key={`${cx}`} cx={cx} cy={cy} rx={r} ry={r * 0.7} fill="#5A43A0" opacity="0.55" />
        ))}

        {/* Placas dorsales */}
        {[[126, 196], [160, 188], [196, 194], [228, 208]].map(([cx, cy]) => (
          <path
            key={`${cx}`}
            d={`M${cx - 9} ${cy + 8} Q${cx} ${cy - 12} ${cx + 9} ${cy + 8} Z`}
            fill="#C4A35A"
            opacity="0.9"
          />
        ))}

        {/* ---------- Cuello largo ---------- */}
        <path
          d="M226 232
             C 262 208, 268 150, 256 104
             C 248 72, 232 54, 214 46
             L 176 62
             C 196 78, 210 100, 216 132
             C 224 174, 214 210, 190 232 Z"
          fill="url(#brachio-body)"
        />
        {/* Sombra interna del cuello */}
        <path
          d="M226 232 C 244 214, 252 182, 250 152 C 240 176, 228 204, 208 226 Z"
          fill="#5A43A0"
          opacity="0.5"
        />

        {/* ---------- Cabeza ---------- */}
        <g>
          <ellipse cx="184" cy="44" rx="46" ry="34" fill="url(#brachio-body)" />
          {/* Hocico */}
          <ellipse cx="150" cy="52" rx="26" ry="20" fill="#B7A8E0" />
          {/* Fosa nasal */}
          <ellipse cx="136" cy="46" rx="4" ry="3" fill="#4A3890" />

          {/* Ojo (parpadea) */}
          <g className="animate-blink" style={eyeStyle}>
            <circle cx="196" cy="36" r="10" fill="#FFFFFF" />
            <circle cx="199" cy="37" r="5" fill="#241A3D" />
            <circle cx="201" cy="35" r="1.7" fill="#FFFFFF" />
          </g>
          {/* Ceja simpática */}
          <path
            d="M186 20 Q197 14 208 20"
            stroke="#4A3890"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />

          {/* Sonrisa */}
          <path
            d="M134 58 Q144 66 156 60"
            stroke="#4A3890"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* ---------- Brazo con la taza ---------- */}
        <path
          d="M214 236 C 238 226, 246 200, 232 186 L 214 196 C 224 206, 220 220, 202 226 Z"
          fill="#6A4DAB"
        />

        {/* ---------- Taza de código ---------- */}
        <g>
          {/* Asa */}
          <path
            d="M148 158 q22 -4 22 14 q0 18 -22 14"
            stroke="#C4A35A"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          {/* Cuerpo de la taza */}
          <rect x="104" y="150" width="48" height="52" rx="8" fill="#F2EFF7" />
          <rect x="104" y="150" width="48" height="10" rx="5" fill="#C4A35A" />
          {/* Café */}
          <ellipse cx="128" cy="162" rx="19" ry="5" fill="#4A3890" />
          {/* Código en la taza */}
          <text
            x="128"
            y="188"
            textAnchor="middle"
            fontFamily="var(--font-mono), monospace"
            fontSize="13"
            fontWeight="700"
            fill="#6A4DAB"
          >
            {'</>'}
          </text>
        </g>

        {/* ---------- Vapor del café (sube y se desvanece) ---------- */}
        <g stroke="#A98FD6" strokeWidth="3" strokeLinecap="round" fill="none">
          <path
            className="animate-steam"
            d="M116 142 q-6 -10 0 -20 q6 -10 0 -20"
            style={{ animationDelay: '0s' }}
          />
          <path
            className="animate-steam"
            d="M130 138 q6 -10 0 -20 q-6 -10 0 -18"
            style={{ animationDelay: '0.9s' }}
          />
          <path
            className="animate-steam"
            d="M142 142 q-5 -9 0 -18"
            style={{ animationDelay: '1.7s' }}
          />
        </g>
      </g>
    </svg>
  );
}
