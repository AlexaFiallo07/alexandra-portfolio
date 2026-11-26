'use client';

import * as THREE from 'three';

/** Paleta compartida por las escenas 3D (coherente con el Studio Light). */
export const DINO_SKIN = {
  skin: '#3E9D7B',
  dark: '#2B775D',
  belly: '#E2F3EA',
  claw: '#1F1433',
  plate: '#6A4DAB',
} as const;

/* Textura procedural de escamas: da relieve a la piel sin assets externos. */
let cachedBump: THREE.CanvasTexture | null = null;
function getSkinBump() {
  if (cachedBump) return cachedBump;
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.fillStyle = '#7f7f7f';
  ctx.fillRect(0, 0, 128, 128);
  for (let row = 0; row < 16; row++) {
    for (let col = 0; col < 16; col++) {
      const tone = 96 + Math.floor(Math.random() * 52);
      ctx.fillStyle = `rgb(${tone},${tone},${tone})`;
      ctx.beginPath();
      ctx.arc(col * 8 + (row % 2) * 4 + 2, row * 8 + 2, 3.1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  cachedBump = texture;
  return texture;
}

/** Paleta del T-Rex robótico: carcasa grafito, paneles esmeralda y juntas moradas. */
export const ROBO_DINO_SKIN = {
  shell: '#334155',
  plate: '#0F766E',
  dark: '#0F172A',
  joint: '#6A4DAB',
  glow: '#5FB794',
  lens: '#A98FD6',
} as const;

/** Material metálico para paneles, bisagras y sensores del T-Rex robótico. */
export function RobotMat({
  color = ROBO_DINO_SKIN.shell,
  metalness = 0.78,
  roughness = 0.28,
  emissive,
  emissiveIntensity = 0,
}: {
  color?: string;
  metalness?: number;
  roughness?: number;
  emissive?: string;
  emissiveIntensity?: number;
}) {
  return (
    <meshStandardMaterial
      color={color}
      metalness={metalness}
      roughness={roughness}
      emissive={emissive ?? '#000000'}
      emissiveIntensity={emissiveIntensity}
    />
  );
}

/** Material de piel con relieve de escamas y acabado semimate. */
export default function SkinMat({
  color = DINO_SKIN.skin,
  roughness = 0.58,
}: {
  color?: string;
  roughness?: number;
}) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={0.16}
      bumpMap={getSkinBump() ?? undefined}
      bumpScale={0.045}
    />
  );
}
