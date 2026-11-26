'use client';

/**
 * Respaldo sin WebGL del T-Rex con gafas. Es el mismo personaje del hero
 * (verde con gafas moradas), dibujado en SVG para que nunca aparezca un
 * robot ni una figura recortada cuando Three.js no está disponible.
 */
export default function HeroTRexFallback() {
  return (
    <div className="studio-grid flex h-full w-full items-center justify-center bg-studio-bg px-6">
      <svg
        viewBox="0 0 480 420"
        className="h-full w-full max-w-[460px]"
        role="img"
        aria-label="T-Rex verde con gafas moradas programando"
      >
        <defs>
          <linearGradient id="trex-fb-body" x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stopColor="#4FB18C" />
            <stop offset="55%" stopColor="#3E9D7B" />
            <stop offset="100%" stopColor="#2B775D" />
          </linearGradient>
          <linearGradient id="trex-fb-belly" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EAF7F0" />
            <stop offset="100%" stopColor="#BFE6D3" />
          </linearGradient>
          <linearGradient id="trex-fb-glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A98FD6" />
            <stop offset="100%" stopColor="#6A4DAB" />
          </linearGradient>
          <filter id="trex-fb-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#3A2370" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Sombra de estudio */}
        <ellipse cx="240" cy="388" rx="140" ry="14" fill="#3A2370" opacity="0.12" />

        <g filter="url(#trex-fb-shadow)">
          {/* Cola */}
          <path
            d="M190 268 Q96 296 52 244 Q44 234 54 230 Q120 270 196 240 Z"
            fill="url(#trex-fb-body)"
            stroke="#1F1433"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Piernas y patas */}
          <path
            d="M190 288 q-16 34 -4 58 l34 2 q-18 -12 -10 -34 l24 -30 Z"
            fill="url(#trex-fb-body)"
            stroke="#1F1433"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M268 288 q14 32 4 58 l34 0 q-6 -24 6 -44 l16 -26 Z"
            fill="url(#trex-fb-body)"
            stroke="#1F1433"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {[186, 206, 272, 292].map((x) => (
            <ellipse key={x} cx={x} cy="352" rx="10" ry="5" fill="#FFFFFF" stroke="#1F1433" strokeWidth="2" />
          ))}

          {/* Cuerpo */}
          <ellipse cx="244" cy="252" rx="96" ry="74" fill="url(#trex-fb-body)" stroke="#1F1433" strokeWidth="4" />
          <ellipse cx="252" cy="270" rx="64" ry="45" fill="url(#trex-fb-belly)" stroke="#2B775D" strokeWidth="1.5" />

          {/* Brazos cortos */}
          <path
            d="M300 236 q34 6 44 34"
            fill="none"
            stroke="#2B775D"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <circle cx="346" cy="272" r="9" fill="#4FB18C" stroke="#1F1433" strokeWidth="2.5" />

          {/* Cabeza y hocico */}
          <path
            d="M292 168 q34 -42 90 -24 q42 14 44 54 q2 26 -24 38 l-52 10 q-44 4 -58 -30 Z"
            fill="url(#trex-fb-body)"
            stroke="#1F1433"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M372 216 q34 -8 52 6 q10 8 -2 18 q-24 14 -52 4 Z"
            fill="url(#trex-fb-belly)"
            stroke="#2B775D"
            strokeWidth="1.5"
          />
          {[386, 402, 418].map((x) => (
            <path key={x} d={`M${x} 226 l3 9 l4 -9`} fill="#FFFFFF" stroke="#1F1433" strokeWidth="1" />
          ))}
        </g>

        {/* Gafas moradas */}
        <g>
          <rect x="314" y="164" width="50" height="38" rx="13" fill="#6A4DAB" fillOpacity="0.28" stroke="#3A2370" strokeWidth="4" />
          <rect x="374" y="164" width="50" height="38" rx="13" fill="#6A4DAB" fillOpacity="0.28" stroke="#3A2370" strokeWidth="4" />
          <path d="M364 180 q10 -6 10 0" fill="none" stroke="#C4A35A" strokeWidth="5" strokeLinecap="round" />
          <path d="M310 176 l-22 -8" stroke="#3A2370" strokeWidth="4" strokeLinecap="round" />
          <circle cx="339" cy="183" r="5" fill="#1F1433" />
          <circle cx="399" cy="183" r="5" fill="#1F1433" />
          <circle cx="341" cy="181" r="1.6" fill="#FFFFFF" />
          <circle cx="401" cy="181" r="1.6" fill="#FFFFFF" />
        </g>

        {/* Detalles dev */}
        <g fontFamily="var(--font-mono), monospace" fontSize="13" fontWeight="600">
          <rect x="34" y="92" width="70" height="30" rx="8" fill="#FFFFFF" stroke="#E4DCF1" />
          <text x="46" y="112" fill="#3A2370">{'<div>'}</text>
          <rect x="352" y="62" width="92" height="30" rx="8" fill="#FFFFFF" stroke="#E4DCF1" />
          <text x="364" y="82" fill="#2B775D">{'{ 3D: true }'}</text>
          <rect x="60" y="334" width="104" height="30" rx="8" fill="#FFFFFF" stroke="#E4DCF1" />
          <text x="72" y="354" fill="#6A4DAB">npm run dev ✓</text>
        </g>
      </svg>
    </div>
  );
}
