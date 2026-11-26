'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface Fossil {
  id: string;
  name: string;
  hint: string;
  x: number;
  y: number;
  color: string;
  shape: 'skull' | 'tricera' | 'stego' | 'brachio' | 'raptor' | 'ammonite';
}

const FOSSILS: Fossil[] = [
  { id: 'trex', name: 'Tyrannosaurus rex', hint: 'El rey del Cretácico', x: 0.24, y: 0.26, color: '#6A4DAB', shape: 'skull' },
  { id: 'tricera', name: 'Triceratops', hint: 'Tres cuernos y gran volante', x: 0.7, y: 0.2, color: '#3E9D7B', shape: 'tricera' },
  { id: 'stego', name: 'Stegosaurus', hint: 'Placas dorsales y cola con púas', x: 0.46, y: 0.52, color: '#3A2370', shape: 'stego' },
  { id: 'brachio', name: 'Brachiosaurus', hint: 'Cuello largo, corazón gigante', x: 0.82, y: 0.56, color: '#2B775D', shape: 'brachio' },
  { id: 'raptor', name: 'Velociraptor', hint: 'Ágil y de garras afiladas', x: 0.2, y: 0.74, color: '#6A4DAB', shape: 'raptor' },
  { id: 'ammonite', name: 'Amonita', hint: 'Espiral marina fósil', x: 0.66, y: 0.82, color: '#3E9D7B', shape: 'ammonite' },
];

/** Dibuja un fósil estilizado centrado en (0,0). */
function drawFossil(ctx: CanvasRenderingContext2D, fossil: Fossil, scale: number) {
  ctx.save();
  ctx.scale(scale, scale);
  ctx.lineWidth = 2.6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = fossil.color;
  ctx.fillStyle = 'rgba(255,255,255,0.82)';

  switch (fossil.shape) {
    case 'skull': {
      ctx.beginPath();
      ctx.ellipse(-4, -4, 23, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(14, -8);
      ctx.lineTo(34, -2);
      ctx.lineTo(31, 10);
      ctx.lineTo(12, 12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-8, -8, 5, 0, Math.PI * 2);
      ctx.fillStyle = fossil.color;
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(17 + i * 4, 10);
        ctx.lineTo(19 + i * 4, 16);
        ctx.stroke();
      }
      break;
    }
    case 'tricera': {
      ctx.beginPath();
      ctx.arc(0, 0, 25, Math.PI, 0);
      ctx.lineTo(18, 16);
      ctx.lineTo(-18, 16);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-10, -20);
      ctx.lineTo(-16, -36);
      ctx.moveTo(0, -25);
      ctx.lineTo(0, -42);
      ctx.moveTo(10, -20);
      ctx.lineTo(16, -36);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-7, 0, 3, 0, Math.PI * 2);
      ctx.arc(8, 0, 3, 0, Math.PI * 2);
      ctx.fillStyle = fossil.color;
      ctx.fill();
      break;
    }
    case 'stego': {
      ctx.beginPath();
      ctx.ellipse(0, 6, 28, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 9 - 4, -6);
        ctx.lineTo(i * 9, -22 - (i === 0 ? 4 : 0));
        ctx.lineTo(i * 9 + 4, -6);
        ctx.closePath();
        ctx.fillStyle = fossil.color;
        ctx.fill();
      }
      ctx.strokeStyle = fossil.color;
      ctx.beginPath();
      ctx.moveTo(-26, 6);
      ctx.lineTo(-39, 2);
      ctx.moveTo(-34, 6);
      ctx.lineTo(-42, 12);
      ctx.stroke();
      break;
    }
    case 'brachio': {
      ctx.beginPath();
      ctx.ellipse(-8, 12, 22, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(8, 6);
      ctx.bezierCurveTo(24, 2, 20, -24, 12, -34);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(11, -38, 10, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-26, 12);
      ctx.lineTo(-40, 8);
      ctx.stroke();
      break;
    }
    case 'raptor': {
      ctx.beginPath();
      ctx.ellipse(0, 2, 20, 10, -0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-18, 2);
      ctx.lineTo(-40, -6);
      ctx.moveTo(12, -2);
      ctx.lineTo(25, -10);
      ctx.lineTo(30, -2);
      ctx.lineTo(18, 5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-6, 10);
      ctx.lineTo(-10, 24);
      ctx.lineTo(-2, 24);
      ctx.moveTo(8, 9);
      ctx.lineTo(6, 22);
      ctx.lineTo(14, 22);
      ctx.stroke();
      break;
    }
    case 'ammonite': {
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 5; a += 0.1) {
        const r = 2 + a * 2.4;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        if (a === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      break;
    }
  }
  ctx.restore();
}

/** Mini-juego: mover el mouse retira tierra y revela fósiles con su nombre. */
export default function FossilDigGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskRef = useRef<HTMLCanvasElement | null>(null);
  const fossilRef = useRef<HTMLCanvasElement | null>(null);
  const compositeRef = useRef<HTMLCanvasElement | null>(null);
  const exposureRef = useRef<Record<string, number>>({});
  const rafRef = useRef(0);
  const [discovered, setDiscovered] = useState<string[]>([]);

  const discoveredSet = new Set(discovered);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const mask = maskRef.current;
    const fossilLayer = fossilRef.current;
    const composite = compositeRef.current;
    if (!canvas || !mask || !fossilLayer || !composite) return;

    const ctx = canvas.getContext('2d');
    const maskCtx = mask.getContext('2d');
    const fossilCtx = fossilLayer.getContext('2d');
    const compCtx = composite.getContext('2d');
    if (!ctx || !maskCtx || !fossilCtx || !compCtx) return;

    const w = canvas.width;
    const h = canvas.height;

    /* Tierra y cuadrícula blueprint */
    const soil = ctx.createLinearGradient(0, 0, w, h);
    soil.addColorStop(0, '#F6F3FB');
    soil.addColorStop(0.55, '#EFEAF7');
    soil.addColorStop(1, '#E4DCF1');
    ctx.fillStyle = soil;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(124,58,237,0.09)';
    ctx.lineWidth = 1;
    const step = Math.max(24, Math.round(w / 12));
    for (let x = 0; x < w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    /* Granos de arena deterministas */
    ctx.fillStyle = 'rgba(91,33,182,0.12)';
    for (let i = 0; i < 90; i++) {
      const x = ((i * 73) % 997) / 997 * w;
      const y = ((i * 137) % 991) / 991 * h;
      ctx.fillRect(x, y, 2, 2);
    }

    /* Capa de fósiles y máscara de tierra ya retirada */
    fossilCtx.clearRect(0, 0, w, h);
    compCtx.clearRect(0, 0, w, h);
    const scale = Math.min(w, h) / 210;
    FOSSILS.forEach((fossil) => {
      fossilCtx.save();
      fossilCtx.translate(fossil.x * w, fossil.y * h);
      drawFossil(fossilCtx, fossil, scale);
      fossilCtx.restore();

      if (discoveredSet.has(fossil.id)) {
        ctx.save();
        ctx.translate(fossil.x * w, fossil.y * h);
        ctx.shadowColor = fossil.color;
        ctx.shadowBlur = 12;
        drawFossil(ctx, fossil, scale);
        ctx.restore();
        ctx.fillStyle = '#1F1433';
        ctx.font = `600 ${Math.max(10, scale * 7)}px ui-monospace, monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(fossil.name, fossil.x * w, fossil.y * h + scale * 48);
      }
    });

    compCtx.drawImage(fossilLayer, 0, 0);
    compCtx.globalCompositeOperation = 'destination-in';
    compCtx.drawImage(mask, 0, 0);
    compCtx.globalCompositeOperation = 'source-over';
    ctx.drawImage(composite, 0, 0);
  }, [discovered]);

  const scheduleRender = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = 0;
      render();
    });
  }, [render]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    maskRef.current = document.createElement('canvas');
    fossilRef.current = document.createElement('canvas');
    compositeRef.current = document.createElement('canvas');

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      for (const c of [canvas, maskRef.current, fossilRef.current, compositeRef.current]) {
        if (!c) continue;
        c.width = w;
        c.height = h;
      }
      scheduleRender();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    return () => {
      observer.disconnect();
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [scheduleRender]);

  useEffect(() => {
    scheduleRender();
  }, [discovered, scheduleRender]);

  const dig = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      const mask = maskRef.current;
      if (!canvas || !mask) return;
      const maskCtx = mask.getContext('2d');
      if (!maskCtx) return;

      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
      const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
      const radius = (event.buttons > 0 ? 54 : 40) * (canvas.width / Math.max(rect.width, 1));
      const gradient = maskCtx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, 'rgba(255,255,255,0.96)');
      gradient.addColorStop(0.62, 'rgba(255,255,255,0.72)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      maskCtx.fillStyle = gradient;
      maskCtx.fillRect(x - radius, y - radius, radius * 2, radius * 2);

      const cssX = event.clientX - rect.left;
      const cssY = event.clientY - rect.top;
      const found = FOSSILS.find((fossil) => {
        if (discoveredSet.has(fossil.id)) return false;
        const fx = fossil.x * rect.width;
        const fy = fossil.y * rect.height;
        const distance = Math.hypot(cssX - fx, cssY - fy);
        if (distance < 20) return true;
        if (distance < 52) {
          exposureRef.current[fossil.id] = (exposureRef.current[fossil.id] ?? 0) + 1;
          return exposureRef.current[fossil.id] > 7;
        }
        return false;
      });

      if (found) {
        setDiscovered((prev) => (prev.includes(found.id) ? prev : [...prev, found.id]));
      }
      scheduleRender();
    },
    [discoveredSet, scheduleRender],
  );

  const reset = () => {
    const mask = maskRef.current;
    if (mask) mask.getContext('2d')?.clearRect(0, 0, mask.width, mask.height);
    exposureRef.current = {};
    setDiscovered([]);
    scheduleRender();
  };

  return (
    <div className="relative mt-8 grid overflow-hidden rounded-3xl border border-studio-border bg-studio-card shadow-studio lg:grid-cols-[1fr_340px]">
      <div className="p-6 sm:p-8">
        <span className="rounded-full border border-studio-green/35 bg-studio-green/15 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-studio-green-deep">
          03 — Zona de excavación
        </span>
        <h3 className="mt-4 font-display text-2xl font-bold text-studio-ink sm:text-3xl">
          Excava fósiles con el mouse
        </h3>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-studio-slate">
          Mueve el cursor sobre la tierra para retirar el polvo. Cada hallazgo revela la silueta y el
          nombre de un dinosaurio. Haz clic y arrastra para excavar más rápido.
        </p>
        <p className="mt-4 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-studio-purple-deep">
          → {discovered.length} / {FOSSILS.length} fósiles descubiertos
        </p>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {FOSSILS.map((fossil) => {
            const found = discoveredSet.has(fossil.id);
            return (
              <div
                key={fossil.id}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors ${
                  found
                    ? 'border-studio-purple/40 bg-studio-purple/10 text-studio-ink'
                    : 'border-studio-border bg-studio-bg/70 text-studio-slate'
                }`}
              >
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: found ? fossil.color : '#E4DCF1' }}
                />
                <span className="min-w-0">
                  <span className="block truncate font-semibold">
                    {found ? fossil.name : '??? sin identificar'}
                  </span>
                  {found && <span className="block truncate text-[10px]">{fossil.hint}</span>}
                </span>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={reset}
          className="mt-5 rounded-full border border-studio-border bg-studio-card px-4 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-studio-purple-deep transition-colors hover:border-studio-purple hover:text-studio-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-studio-purple"
        >
          ↺ Volver a enterrar
        </button>
      </div>

      <div
        ref={containerRef}
        className="studio-grid relative h-72 border-t border-studio-border bg-studio-pearl/40 lg:border-l lg:border-t-0"
      >
        <canvas
          ref={canvasRef}
          onPointerMove={dig}
          onPointerDown={dig}
          className="h-full w-full cursor-crosshair touch-none"
          role="img"
          aria-label="Zona de excavación: mueve el mouse para descubrir fósiles"
        />
        <span className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-studio-border bg-studio-card/90 px-2.5 py-1 font-mono text-[10px] font-semibold text-studio-slate shadow-sm">
          yacimiento · 6 especies
        </span>
      </div>
    </div>
  );
}
