'use client';

import * as THREE from 'three';

/** Paleta compartida por las escenas 3D (coherente con el Studio Light). */
export const DINO_SKIN = {
  skin: '#3E9E70',
  dark: '#2E7D57',
  belly: '#D1FAE5',
  claw: '#18181B',
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

/** Material de piel con relieve de escamas y acabado semimate. */
export default function SkinMat({
  color = DINO_SKIN.skin,
  roughness = 0.88,
}: {
  color?: string;
  roughness?: number;
}) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      bumpMap={getSkinBump() ?? undefined}
      bumpScale={0.035}
    />
  );
}
