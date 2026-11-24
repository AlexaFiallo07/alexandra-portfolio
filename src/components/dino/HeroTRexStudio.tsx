'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import CanvasLoader from '@/components/3d/CanvasLoader';

const HeroTRex3D = dynamic(() => import('@/components/dino/HeroTRex3D'), {
  ssr: false,
  loading: () => <CanvasLoader label="Despertando al T-Rex…" />,
});

const ROAR_LINES = [
  'RAWR! 200 OK',
  '¡Cero bugs hoy!',
  'git push --roar',
  'npm run build ✓',
];

/**
 * Escena ilustrada interactiva del Hero (Studio Light):
 * - T-Rex verde simpático con gafas de pasta moradas programando en portátil con stickers
 * - Ventanas flotantes de código (<div>, { }, bug) con parallax al mover el mouse
 * - Pupilas que siguen el cursor y reacción divertida al clic
 */
export default function HeroTRexStudio() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pupilLRef = useRef<SVGGElement>(null);
  const pupilRRef = useRef<SVGGElement>(null);
  const win1Ref = useRef<HTMLDivElement>(null);
  const win2Ref = useRef<HTMLDivElement>(null);
  const win3Ref = useRef<HTMLDivElement>(null);
  const win4Ref = useRef<HTMLDivElement>(null);

  const [roarIdx, setRoarIdx] = useState<number | null>(null);
  const [bouncing, setBouncing] = useState(false);
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
      setWebglOk(Boolean(gl));
    } catch {
      setWebglOk(false);
    }
  }, []);

  useEffect(() => {
    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;

    const onPointerMove = (e: PointerEvent) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const tick = () => {
      curX += (targetX - curX) * 0.12;
      curY += (targetY - curY) * 0.12;

      const px = curX * 3.6;
      const py = curY * 2.8;
      if (pupilLRef.current) pupilLRef.current.setAttribute('transform', `translate(${px.toFixed(2)}, ${py.toFixed(2)})`);
      if (pupilRRef.current) pupilRRef.current.setAttribute('transform', `translate(${px.toFixed(2)}, ${py.toFixed(2)})`);

      if (win1Ref.current) win1Ref.current.style.transform = `translate3d(${(curX * -14).toFixed(1)}px, ${(curY * -10).toFixed(1)}px, 0)`;
      if (win2Ref.current) win2Ref.current.style.transform = `translate3d(${(curX * 16).toFixed(1)}px, ${(curY * -12).toFixed(1)}px, 0)`;
      if (win3Ref.current) win3Ref.current.style.transform = `translate3d(${(curX * -10).toFixed(1)}px, ${(curY * 14).toFixed(1)}px, 0)`;
      if (win4Ref.current) win4Ref.current.style.transform = `translate3d(${(curX * 12).toFixed(1)}px, ${(curY * 10).toFixed(1)}px, 0)`;

      raf = window.requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    raf = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  const handleInteract = () => {
    setBouncing(true);
    setRoarIdx((prev) => (prev === null ? 0 : (prev + 1) % ROAR_LINES.length));
    window.setTimeout(() => setBouncing(false), 450);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleInteract}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleInteract();
        }
      }}
      aria-label="T-Rex programando con gafas moradas: haz clic para interactuar"
      className="group relative flex h-full w-full cursor-pointer select-none items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFFFFF] via-[#F4F4F7] to-[#E8E8EE] p-4 sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-studio-purple"
    >
      {/* Cuadrícula blueprint sutil del estudio */}
      <div aria-hidden className="studio-grid pointer-events-none absolute inset-0 opacity-90" />

      {/* Acentos suaves de color estudio */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-studio-purple/10 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-studio-green/15 blur-2xl"
      />

      {/* ---------- Ventanas flotantes de código con parallax ---------- */}
      <div
        ref={win1Ref}
        aria-hidden
        className="pointer-events-none absolute left-4 top-12 z-20 rounded-xl border border-studio-border bg-studio-card px-3 py-2 shadow-studio transition-transform duration-75 sm:left-6 sm:top-14"
      >
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-studio-purple" />
          <span className="h-2 w-2 rounded-full bg-studio-green" />
          <span className="ml-1 font-mono text-[9px] text-studio-slate">layout.tsx</span>
        </div>
        <p className="mt-1 font-mono text-[11px] font-semibold text-studio-purple-deep">&lt;div className=&quot;dino&quot;&gt;</p>
      </div>

      <div
        ref={win2Ref}
        aria-hidden
        className="pointer-events-none absolute right-4 top-16 z-20 rounded-xl border border-studio-border bg-studio-card px-3 py-2 shadow-studio transition-transform duration-75 sm:right-6"
      >
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-studio-green" />
          <span className="font-mono text-[9px] text-studio-slate">api.py</span>
        </div>
        <p className="mt-1 font-mono text-[11px] font-semibold text-studio-green-deep">{'{ status: 200 }'}</p>
      </div>

      <div
        ref={win3Ref}
        aria-hidden
        className="pointer-events-none absolute bottom-20 left-4 z-20 flex items-center gap-2 rounded-xl border border-studio-border bg-studio-card px-3 py-1.5 shadow-studio transition-transform duration-75 sm:left-7"
      >
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-studio-green/15 font-mono text-[11px] text-studio-green-deep">
          🐞
        </span>
        <span className="font-mono text-[10px] font-medium text-studio-ink">0 bugs</span>
      </div>

      <div
        ref={win4Ref}
        aria-hidden
        className="pointer-events-none absolute bottom-24 right-4 z-20 rounded-xl border border-studio-purple/30 bg-studio-pearl px-3 py-1.5 shadow-studio transition-transform duration-75 sm:right-7"
      >
        <span className="font-mono text-[10px] font-semibold text-studio-purple-deep">git push origin main</span>
      </div>

      {/* Burbuja de diálogo al hacer clic */}
      {roarIdx !== null && (
        <div className="absolute left-1/2 top-11 z-30 -translate-x-1/2 animate-bounce rounded-full border-2 border-studio-purple-deep bg-studio-card px-4 py-1.5 font-mono text-xs font-bold text-studio-purple-deep shadow-brutal">
          {ROAR_LINES[roarIdx]}
        </div>
      )}

      {/* ---------- T-Rex 3D (vitrina interactiva) con fallback SVG ---------- */}
      {webglOk ? (
        <div
          className={`relative z-10 h-full w-full transition-transform duration-300 ${
            bouncing ? '-translate-y-3 scale-[1.03]' : ''
          }`}
        >
          <HeroTRex3D />
        </div>
      ) : (
        <>
      <svg
        viewBox="0 0 420 380"
        className={`relative z-10 h-auto w-full max-w-[390px] transition-transform duration-300 ${
          bouncing ? '-translate-y-3 scale-[1.03]' : 'animate-float-soft'
        }`}
        role="img"
        aria-label="Ilustración de T-Rex verde con gafas de pasta moradas programando en portátil con stickers"
      >
        <defs>
          <linearGradient id="trex-green" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="trex-belly" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D1FAE5" />
            <stop offset="100%" stopColor="#A7F3D0" />
          </linearGradient>
        </defs>

        {/* Sombra de estudio en el suelo */}
        <ellipse cx="215" cy="322" rx="135" ry="16" fill="#5B21B6" opacity="0.1" />

        {/* Escritorio minimalista */}
        <rect x="78" y="294" width="276" height="14" rx="7" fill="#FFFFFF" stroke="#18181B" strokeWidth="3" />
        <rect x="92" y="308" width="248" height="6" rx="3" fill="#D8D8E2" />

        {/* Cola del T-Rex */}
        <g className="animate-tail-wag" style={{ transformBox: 'fill-box', transformOrigin: 'right center' }}>
          <path
            d="M126 244 Q52 246 42 198 Q78 220 132 214 Z"
            fill="url(#trex-green)"
            stroke="#18181B"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
        </g>

        {/* Púas dorsales moradas */}
        {[
          [116, 178, 12],
          [124, 152, 14],
          [134, 126, 13],
        ].map(([cx, cy, r]) => (
          <path
            key={`${cx}-${cy}`}
            d={`M${cx - r} ${cy + 4} L${cx - r - 10} ${cy - 4} L${cx + 2} ${cy - r} Z`}
            fill="#7C3AED"
            stroke="#18181B"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
        ))}

        {/* Cuerpo del T-Rex */}
        <ellipse
          cx="172"
          cy="232"
          rx="66"
          ry="72"
          fill="url(#trex-green)"
          stroke="#18181B"
          strokeWidth="3.5"
        />
        {/* Vientre menta claro */}
        <ellipse cx="192" cy="240" rx="40" ry="54" fill="url(#trex-belly)" />
        {/* Líneas de barriga */}
        {[218, 236, 254, 272].map((y) => (
          <path key={y} d={`M166 ${y} q26 7 50 0`} stroke="#059669" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.55" />
        ))}

        {/* Cabeza estilizada */}
        <g>
          {/* Cráneo y hocico */}
          <path
            d="M124 148
               C 122 96, 156 68, 206 68
               C 254 68, 286 82, 288 108
               C 290 124, 272 134, 248 134
               L 216 134
               C 220 144, 240 150, 260 150
               C 266 150, 268 162, 252 166
               C 226 172, 186 172, 162 178
               C 140 182, 126 168, 124 148 Z"
            fill="url(#trex-green)"
            stroke="#18181B"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Dientecitos divertidos */}
          {[226, 240, 254].map((x) => (
            <polygon
              key={x}
              points={`${x},134 ${x + 5},144 ${x + 10},134`}
              fill="#FFFFFF"
              stroke="#18181B"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          ))}

          {/* Fosa nasal */}
          <circle cx="268" cy="96" r="3.5" fill="#18181B" />

          {/* Mejilla / sonrisa */}
          <ellipse cx="182" cy="126" rx="10" ry="5.5" fill="#7C3AED" opacity="0.22" />

          {/* ---------- Ojos con seguimiento del cursor ---------- */}
          {/* Ojo izquierdo */}
          <g>
            <circle cx="176" cy="102" r="14" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.6" />
            <g ref={pupilLRef}>
              <circle cx="178" cy="102" r="6.5" fill="#18181B" />
              <circle cx="180.5" cy="99.5" r="2.3" fill="#FFFFFF" />
            </g>
          </g>
          {/* Ojo derecho */}
          <g>
            <circle cx="216" cy="102" r="14" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.6" />
            <g ref={pupilRRef}>
              <circle cx="218" cy="102" r="6.5" fill="#18181B" />
              <circle cx="220.5" cy="99.5" r="2.3" fill="#FFFFFF" />
            </g>
          </g>

          {/* ---------- Gafas de pasta moradas (#5B21B6 / #7C3AED) ---------- */}
          <g>
            {/* Patilla */}
            <path d="M128 98 L155 98" stroke="#5B21B6" strokeWidth="6" strokeLinecap="round" />
            {/* Marco izquierdo */}
            <rect
              x="156"
              y="84"
              width="38"
              height="34"
              rx="9"
              fill="#7C3AED"
              fillOpacity="0.14"
              stroke="#5B21B6"
              strokeWidth="5.5"
            />
            {/* Puente */}
            <path d="M194 98 Q196 93 198 98" stroke="#5B21B6" strokeWidth="5.5" fill="none" strokeLinecap="round" />
            {/* Marco derecho */}
            <rect
              x="198"
              y="84"
              width="38"
              height="34"
              rx="9"
              fill="#7C3AED"
              fillOpacity="0.14"
              stroke="#5B21B6"
              strokeWidth="5.5"
            />
            {/* Brillo en los cristales */}
            <path d="M163 92 L171 100" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
            <path d="M205 92 L213 100" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
          </g>
        </g>

        {/* Bracitos tecleando */}
        <path
          d="M210 214 Q236 226 244 258"
          stroke="#18181B"
          strokeWidth="15"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M210 214 Q236 226 244 258"
          stroke="#10B981"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />

        {/* Taza de café de estudio al lado */}
        <g transform="translate(106, 258)">
          <rect x="0" y="6" width="26" height="30" rx="5" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.8" />
          <path d="M26 14 q9 0 9 7 q0 7 -9 7" fill="none" stroke="#18181B" strokeWidth="2.8" />
          <rect x="4" y="12" width="18" height="4" rx="2" fill="#7C3AED" />
          <path d="M8 -2 q-3 -5 0 -9 M16 -2 q3 -5 0 -9" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" fill="none" className="animate-steam" />
        </g>

        {/* ---------- Portátil lleno de stickers ---------- */}
        <g>
          {/* Base del teclado */}
          <path
            d="M214 294 L228 282 L316 282 L328 294 Z"
            fill="#E8E8EE"
            stroke="#18181B"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Tapa trasera / pantalla vista en ángulo 3/4 */}
          <path
            d="M244 210 L338 206 L320 282 L228 282 Z"
            fill="#FFFFFF"
            stroke="#18181B"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Marco interior morado */}
          <path
            d="M250 216 L330 213 L315 275 L236 275 Z"
            fill="#F4F4F7"
            stroke="#7C3AED"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Stickers pegados en la tapa del portátil */}
          {/* Sticker 1: </> morado */}
          <g transform="translate(260, 224) rotate(-8)">
            <rect width="28" height="16" rx="4" fill="#7C3AED" stroke="#18181B" strokeWidth="1.8" />
            <text x="14" y="11.5" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="700" fontFamily="monospace">
              {'</>'}
            </text>
          </g>
          {/* Sticker 2: Huella verde */}
          <g transform="translate(298, 222) rotate(10)">
            <circle cx="11" cy="11" r="10" fill="#10B981" stroke="#18181B" strokeWidth="1.8" />
            <circle cx="7" cy="8" r="1.8" fill="#FFFFFF" />
            <circle cx="11" cy="6.5" r="1.8" fill="#FFFFFF" />
            <circle cx="15" cy="8" r="1.8" fill="#FFFFFF" />
            <ellipse cx="11" cy="13.5" rx="4" ry="3" fill="#FFFFFF" />
          </g>
          {/* Sticker 3: JS / PY badge */}
          <g transform="translate(248, 248) rotate(5)">
            <rect width="26" height="15" rx="3" fill="#10B981" stroke="#18181B" strokeWidth="1.8" />
            <text x="13" y="10.5" textAnchor="middle" fill="#18181B" fontSize="8" fontWeight="800" fontFamily="monospace">
              DEV
            </text>
          </g>
          {/* Sticker 4: Corazón / Rayo morado */}
          <g transform="translate(284, 248) rotate(-6)">
            <rect width="26" height="16" rx="8" fill="#5B21B6" stroke="#18181B" strokeWidth="1.8" />
            <text x="13" y="11" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="700" fontFamily="monospace">
              {'{ }'}
            </text>
          </g>
        </g>

        {/* Segundo bracito sobre el teclado */}
        <path
          d="M190 226 Q216 248 238 268"
          stroke="#18181B"
          strokeWidth="15"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M190 226 Q216 248 238 268"
          stroke="#10B981"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
        </>
      )}
    </div>
  );
}
