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
  const [roarSignal, setRoarSignal] = useState(0);
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
    setRoarSignal((prev) => prev + 1);
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
          <HeroTRex3D roarSignal={roarSignal} />
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
          <linearGradient id="trex-green" x1="0" y1="0" x2="0.18" y2="1">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="52%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <radialGradient id="trex-belly" cx="50%" cy="28%" r="78%">
            <stop offset="0%" stopColor="#D1FAE5" />
            <stop offset="68%" stopColor="#D1FAE5" />
            <stop offset="100%" stopColor="#A7F3D0" />
          </radialGradient>
          <linearGradient id="trex-plate" x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#5B21B6" />
          </linearGradient>
          <linearGradient id="trex-desk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E8E8EE" />
          </linearGradient>
          <linearGradient id="trex-screen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E8E8EE" />
          </linearGradient>
          <pattern id="trex-scales" width="18" height="16" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="2.2" fill="#FFFFFF" opacity="0.2" />
            <circle cx="13" cy="11" r="1.6" fill="#059669" opacity="0.12" />
          </pattern>
          <filter id="trex-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#5B21B6" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Sombra de estudio en el suelo */}
        <ellipse cx="215" cy="322" rx="135" ry="16" fill="#5B21B6" opacity="0.09" />
        <ellipse cx="215" cy="322" rx="92" ry="8" fill="#5B21B6" opacity="0.08" />

        {/* Escritorio minimalista con canto */}
        <rect x="78" y="294" width="276" height="14" rx="7" fill="url(#trex-desk)" stroke="#18181B" strokeWidth="3" />
        <path d="M90 298 h252" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
        <rect x="92" y="308" width="248" height="6" rx="3" fill="#D8D8E2" stroke="#18181B" strokeWidth="1.4" />

        {/* Cola del T-Rex con relieve y pliegues */}
        <g className="animate-tail-wag" style={{ transformBox: 'fill-box', transformOrigin: 'right center' }}>
          <path
            d="M130 244 Q54 250 38 196 Q34 186 43 188 Q76 216 136 212 Z"
            fill="url(#trex-green)"
            stroke="#18181B"
            strokeWidth="3.2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path d="M50 198 Q74 222 112 230" stroke="#D1FAE5" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.62" />
          <path d="M66 208 q7 7 4 15 M88 219 q7 6 4 13" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
        </g>

        {/* Púas dorsales moradas con brillo editorial */}
        {[
          [116, 178, 12],
          [124, 152, 14],
          [134, 126, 13],
        ].map(([cx, cy, r]) => (
          <g key={`${cx}-${cy}`}>
            <path
              d={`M${cx - r} ${cy + 4} L${cx - r - 10} ${cy - 4} L${cx + 2} ${cy - r} Z`}
              fill="url(#trex-plate)"
              stroke="#18181B"
              strokeWidth="2.8"
              strokeLinejoin="round"
            />
            <path
              d={`M${cx - r + 3} ${cy - 1} L${cx - r - 3} ${cy - 4}`}
              stroke="#FFFFFF"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
              opacity="0.55"
            />
          </g>
        ))}

        {/* Cuerpo del T-Rex con textura de escamas */}
        <g filter="url(#trex-shadow)">
          <ellipse
            cx="172"
            cy="232"
            rx="66"
            ry="72"
            fill="url(#trex-green)"
            stroke="#18181B"
            strokeWidth="3.5"
          />
        </g>
        <ellipse cx="172" cy="232" rx="64" ry="70" fill="url(#trex-scales)" />
        <path d="M122 204 Q136 170 166 166" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5" />
        {/* Vientre menta claro */}
        <ellipse cx="192" cy="240" rx="40" ry="54" fill="url(#trex-belly)" stroke="#A7F3D0" strokeWidth="1.4" />
        {/* Líneas de barriga */}
        {[214, 232, 250, 268].map((y) => (
          <path key={y} d={`M166 ${y} q26 7 50 0`} stroke="#059669" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.45" />
        ))}

        {/* Cabeza estilizada */}
        <g>
          {/* Cráneo y hocico */}
          <g filter="url(#trex-shadow)">
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
          </g>
          <path d="M136 130 Q156 102 196 94" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" fill="none" opacity="0.55" />
          {/* Oreja / abertura auditiva */}
          <ellipse cx="136" cy="116" rx="6.5" ry="9" fill="#059669" stroke="#18181B" strokeWidth="2" />
          <ellipse cx="136" cy="116" rx="2.8" ry="4.6" fill="#D1FAE5" opacity="0.85" />

          {/* Mandíbula interior, lengua y dientecitos divertidos */}
          <path d="M212 146 Q236 144 258 152 Q244 168 216 168 Q204 162 212 146 Z" fill="url(#trex-belly)" stroke="#18181B" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M226 162 q12 -7 22 -1 q-8 7 -22 1 Z" fill="#7C3AED" opacity="0.55" />
          {[222, 236, 250].map((x) => (
            <polygon
              key={x}
              points={`${x},134 ${x + 5},145 ${x + 10},134`}
              fill="#FFFFFF"
              stroke="#18181B"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          ))}

          {/* Fosa nasal con brillo */}
          <circle cx="268" cy="96" r="3.8" fill="#18181B" />
          <circle cx="269.2" cy="94.8" r="1.2" fill="#FFFFFF" opacity="0.9" />
          {/* Cejas inclinadas */}
          <path d="M164 78 q13 -8 24 -3" stroke="#18181B" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          <path d="M205 75 q12 -5 23 3" stroke="#18181B" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          {/* Mejilla / sonrisa */}
          <ellipse cx="182" cy="126" rx="11" ry="6" fill="#7C3AED" opacity="0.22" />
          <ellipse cx="178" cy="123" rx="3.5" ry="1.6" fill="#FFFFFF" opacity="0.35" />
          <path d="M172 136 q10 7 20 1" stroke="#5B21B6" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.5" />

          {/* ---------- Ojos con seguimiento del cursor ---------- */}
          {/* Ojo izquierdo */}
          <g>
            <circle cx="176" cy="102" r="14" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.6" />
            <g ref={pupilLRef}>
              <circle cx="178" cy="102" r="6.5" fill="#18181B" />
              <circle cx="180.5" cy="99.5" r="2.3" fill="#FFFFFF" />
              <circle cx="175.4" cy="105" r="1" fill="#FFFFFF" opacity="0.85" />
            </g>
          </g>
          {/* Ojo derecho */}
          <g>
            <circle cx="216" cy="102" r="14" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.6" />
            <g ref={pupilRRef}>
              <circle cx="218" cy="102" r="6.5" fill="#18181B" />
              <circle cx="220.5" cy="99.5" r="2.3" fill="#FFFFFF" />
              <circle cx="215.4" cy="105" r="1" fill="#FFFFFF" opacity="0.85" />
            </g>
          </g>
          {/* Párpados suaves */}
          <path d="M164 91 Q176 84 188 91" stroke="#5B21B6" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.4" />
          <path d="M204 91 Q216 84 228 91" stroke="#5B21B6" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.4" />

          {/* ---------- Gafas de pasta moradas (#5B21B6 / #7C3AED) ---------- */}
          <g>
            {/* Patilla con canto y brillo */}
            <path d="M128 98 L155 98" stroke="#18181B" strokeWidth="8" strokeLinecap="round" />
            <path d="M128 98 L155 98" stroke="#5B21B6" strokeWidth="5" strokeLinecap="round" />
            {/* Marco izquierdo */}
            <rect
              x="156"
              y="84"
              width="38"
              height="34"
              rx="9"
              fill="#7C3AED"
              fillOpacity="0.14"
              stroke="#18181B"
              strokeWidth="8"
            />
            <rect
              x="156"
              y="84"
              width="38"
              height="34"
              rx="9"
              fill="none"
              stroke="#5B21B6"
              strokeWidth="5.5"
            />
            {/* Puente */}
            <path d="M194 98 Q196 92 198 98" stroke="#18181B" strokeWidth="8" fill="none" strokeLinecap="round" />
            <path d="M194 98 Q196 92 198 98" stroke="#5B21B6" strokeWidth="5.5" fill="none" strokeLinecap="round" />
            {/* Marco derecho */}
            <rect
              x="198"
              y="84"
              width="38"
              height="34"
              rx="9"
              fill="#7C3AED"
              fillOpacity="0.14"
              stroke="#18181B"
              strokeWidth="8"
            />
            <rect
              x="198"
              y="84"
              width="38"
              height="34"
              rx="9"
              fill="none"
              stroke="#5B21B6"
              strokeWidth="5.5"
            />
            {/* Brillo en los cristales y tornillitos */}
            <path d="M163 92 L171 100" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
            <path d="M165 89 L174 98" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
            <path d="M205 92 L213 100" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
            <path d="M207 89 L216 98" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
            <circle cx="160" cy="88" r="1.4" fill="#7C3AED" />
            <circle cx="232" cy="114" r="1.4" fill="#7C3AED" />
            <path d="M166 114 q11 4 22 0 M208 114 q11 4 22 0" stroke="#7C3AED" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.55" />
          </g>
        </g>

        {/* Bracitos tecleando con manita y dedos */}
        <path
          d="M210 214 Q236 226 244 258"
          stroke="#18181B"
          strokeWidth="15"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M210 214 Q236 226 244 258"
          stroke="url(#trex-green)"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M216 218 Q234 230 240 250" stroke="#D1FAE5" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.6" />
        <ellipse cx="244" cy="260" rx="9" ry="6.5" fill="#10B981" stroke="#18181B" strokeWidth="2" />
        {[239, 243, 247].map((x) => (
          <path key={x} d={`M${x} 263 l1 3`} stroke="#D1FAE5" strokeWidth="1.4" strokeLinecap="round" />
        ))}

        {/* Taza de café de estudio al lado */}
        <g transform="translate(106, 258)">
          <path d="M26 14 q10 0 10 7 q0 7 -10 7" fill="none" stroke="#18181B" strokeWidth="7" strokeLinecap="round" />
          <path d="M26 14 q10 0 10 7 q0 7 -10 7" fill="none" stroke="#5B21B6" strokeWidth="3.4" strokeLinecap="round" />
          <rect x="0" y="6" width="26" height="30" rx="5" fill="url(#trex-screen)" stroke="#18181B" strokeWidth="2.8" />
          <rect x="2" y="8" width="22" height="4" rx="2" fill="#5B21B6" opacity="0.65" />
          <path d="M4 15 v15" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
          <rect x="4" y="12" width="18" height="4" rx="2" fill="#7C3AED" />
          <ellipse cx="13" cy="19" rx="6" ry="2" fill="#5B21B6" opacity="0.18" />
          <path className="animate-steam" d="M8 -2 q-3 -5 0 -9" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path className="animate-steam" d="M16 -2 q3 -5 0 -9" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" fill="none" style={{ animationDelay: '0.7s' }} />
        </g>

        {/* ---------- Portátil lleno de stickers ---------- */}
        <g>
          {/* Base del teclado con teclas */}
          <path
            d="M214 294 L228 282 L316 282 L328 294 Z"
            fill="url(#trex-desk)"
            stroke="#18181B"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {[240, 252, 264, 276, 288, 300].map((x) => (
            <path key={x} d={`M${x} 286 h6`} stroke="#D8D8E2" strokeWidth="1.6" strokeLinecap="round" />
          ))}
          <path d="M262 291 h20" stroke="#D8D8E2" strokeWidth="2" strokeLinecap="round" />
          {/* Tapa trasera / pantalla vista en ángulo 3/4 */}
          <path
            d="M244 210 L338 206 L320 282 L228 282 Z"
            fill="url(#trex-screen)"
            stroke="#18181B"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <path d="M246 212 L252 212 L236 278 L230 278 Z" fill="#FFFFFF" opacity="0.75" />
          {/* Marco interior morado */}
          <path
            d="M250 216 L330 213 L315 275 L236 275 Z"
            fill="#F4F4F7"
            stroke="#7C3AED"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M253 218 L272 217 L252 258 L240 258 Z" fill="#FFFFFF" opacity="0.6" />

          {/* Stickers pegados en la tapa del portátil */}
          {/* Sticker 1: </> morado */}
          <g transform="translate(260, 224) rotate(-8)" filter="url(#trex-shadow)">
            <rect width="28" height="16" rx="4" fill="#7C3AED" stroke="#18181B" strokeWidth="1.8" />
            <path d="M3 3 h9" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />
            <text x="14" y="11.5" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="700" fontFamily="monospace">
              {'</>'}
            </text>
          </g>
          {/* Sticker 2: Huella verde */}
          <g transform="translate(298, 222) rotate(10)" filter="url(#trex-shadow)">
            <circle cx="11" cy="11" r="10" fill="#10B981" stroke="#18181B" strokeWidth="1.8" />
            <circle cx="7" cy="8" r="1.8" fill="#FFFFFF" />
            <circle cx="11" cy="6.5" r="1.8" fill="#FFFFFF" />
            <circle cx="15" cy="8" r="1.8" fill="#FFFFFF" />
            <ellipse cx="11" cy="13.5" rx="4" ry="3" fill="#FFFFFF" />
            <path d="M5 14 q6 5 12 0" stroke="#D1FAE5" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.8" />
          </g>
          {/* Sticker 3: DEV badge */}
          <g transform="translate(248, 248) rotate(5)" filter="url(#trex-shadow)">
            <rect width="26" height="15" rx="3" fill="#10B981" stroke="#18181B" strokeWidth="1.8" />
            <path d="M3 3 h7" stroke="#FFFFFF" strokeWidth="1.1" strokeLinecap="round" opacity="0.6" />
            <text x="13" y="10.5" textAnchor="middle" fill="#18181B" fontSize="8" fontWeight="800" fontFamily="monospace">
              DEV
            </text>
          </g>
          {/* Sticker 4: Rayo morado */}
          <g transform="translate(284, 248) rotate(-6)" filter="url(#trex-shadow)">
            <rect width="26" height="16" rx="8" fill="#5B21B6" stroke="#18181B" strokeWidth="1.8" />
            <path d="M4 4 h8" stroke="#FFFFFF" strokeWidth="1.1" strokeLinecap="round" opacity="0.55" />
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
          stroke="url(#trex-green)"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M196 231 Q218 252 234 265" stroke="#D1FAE5" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.6" />
        <ellipse cx="238" cy="270" rx="8" ry="5.5" fill="#10B981" stroke="#18181B" strokeWidth="2" />
        {[234, 238, 242].map((x) => (
          <path key={x} d={`M${x} 273 l1 3`} stroke="#D1FAE5" strokeWidth="1.3" strokeLinecap="round" />
        ))}
      </svg>
        </>
      )}
    </div>
  );
}
