'use client';

import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { DustApi } from './types';

const PARTICLES = 320;

/** Polvo que se dispersa al cepillar o cincelar el terreno. */
export default function DustBurst({ api }: { api: RefObject<DustApi> }) {
  const positions = useMemo(() => new Float32Array(PARTICLES * 3), []);
  const lives = useMemo(() => new Float32Array(PARTICLES), []);
  const velocities = useRef(new Float32Array(PARTICLES * 3));
  const cursor = useRef(0);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aLife', new THREE.BufferAttribute(lives, 1));
    return geo;
  }, [positions, lives]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color('#C9B391') },
          uSize: { value: 0.5 },
        },
        vertexShader: `
          attribute float aLife;
          varying float vLife;
          uniform float uSize;
          void main() {
            vLife = aLife;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = uSize * (220.0 / max(0.1, -mv.z)) * (0.55 + aLife * 0.45);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          varying float vLife;
          void main() {
            float d = length(gl_PointCoord - vec2(0.5));
            float alpha = smoothstep(0.5, 0.06, d) * vLife * 0.8;
            if (alpha < 0.01) discard;
            gl_FragColor = vec4(uColor, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
      }),
    [],
  );

  useEffect(() => {
    api.current.emit = (x: number, z: number, strength: number) => {
      const count = Math.round(4 + strength * 8);
      for (let k = 0; k < count; k += 1) {
        const index = cursor.current % PARTICLES;
        cursor.current += 1;
        const p = index * 3;
        positions[p] = x + (Math.random() - 0.5) * 0.14;
        positions[p + 1] = 0.03 + Math.random() * 0.05;
        positions[p + 2] = z + (Math.random() - 0.5) * 0.14;
        velocities.current[p] = (Math.random() - 0.5) * 0.5;
        velocities.current[p + 1] = 0.3 + Math.random() * 0.55 * strength;
        velocities.current[p + 2] = (Math.random() - 0.5) * 0.5;
        lives[index] = 0.6 + Math.random() * 0.4;
      }
    };
    return () => {
      delete api.current.emit;
    };
  }, [api, positions, lives]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    let dirty = false;
    for (let i = 0; i < PARTICLES; i += 1) {
      if (lives[i] <= 0) continue;
      const p = i * 3;
      velocities.current[p + 1] -= 1.6 * dt;
      positions[p] += velocities.current[p] * dt;
      positions[p + 1] += velocities.current[p + 1] * dt;
      positions[p + 2] += velocities.current[p + 2] * dt;
      if (positions[p + 1] < 0.012) {
        positions[p + 1] = 0.012;
        lives[i] = 0;
      }
      lives[i] = Math.max(0, lives[i] - dt * 0.9);
      dirty = true;
    }
    if (!dirty) return;
    (geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (geometry.attributes.aLife as THREE.BufferAttribute).needsUpdate = true;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
