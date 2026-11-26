'use client';

import { useCallback, useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import {
  BED_DEPTH,
  BED_WIDTH,
  MAX_DEPTH,
  TERRAIN_SEG_X,
  TERRAIN_SEG_Z,
  TOOL_SETTINGS,
} from './constants';
import { getSoilMaps } from './textures';
import type { DigPoint, DustApi, ExcavationTool, Specimen } from './types';

interface TerrainProps {
  specimen: Specimen;
  tool: ExcavationTool;
  enabled: boolean;
  queue: RefObject<DigPoint[]>;
  dustApi: RefObject<DustApi>;
  onProgress: (value: number) => void;
}

/**
 * Lecho deformable: malla subdivisionada cuyos vértices bajan al cepillar.
 * El color por vértice mezcla arena clara y tierra húmeda según la profundidad.
 */
export default function Terrain({
  specimen,
  tool,
  enabled,
  queue,
  dustApi,
  onProgress,
}: TerrainProps) {
  const maps = useMemo(() => getSoilMaps(), []);
  const normalScale = useMemo(() => new THREE.Vector2(0.9, 0.9), []);
  const sand = useMemo(() => new THREE.Color('#FFFFFF'), []);
  const moist = useMemo(() => new THREE.Color('#6E5A43'), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  const { geometry, heights, xs, zs } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(BED_WIDTH, BED_DEPTH, TERRAIN_SEG_X, TERRAIN_SEG_Z);
    geo.rotateX(-Math.PI / 2);
    const position = geo.attributes.position as THREE.BufferAttribute;
    const count = position.count;
    const heightsArr = new Float32Array(count);
    const xsArr = new Float32Array(count);
    const zsArr = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      xsArr[i] = position.getX(i);
      zsArr[i] = position.getZ(i);
    }
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3).fill(1), 3));
    return { geometry: geo, heights: heightsArr, xs: xsArr, zs: zsArr };
  }, []);

  const dragging = useRef(false);
  const lastCheck = useRef(0);
  const lastReported = useRef(-1);

  /** Altura interpolada en un punto X/Z del lecho. */
  const sampleHeight = useCallback(
    (x: number, z: number): number => {
      const gx = ((x + BED_WIDTH / 2) / BED_WIDTH) * TERRAIN_SEG_X;
      const gz = ((z + BED_DEPTH / 2) / BED_DEPTH) * TERRAIN_SEG_Z;
      const ix = Math.max(0, Math.min(TERRAIN_SEG_X - 1, Math.floor(gx)));
      const iz = Math.max(0, Math.min(TERRAIN_SEG_Z - 1, Math.floor(gz)));
      const fx = Math.max(0, Math.min(1, gx - ix));
      const fz = Math.max(0, Math.min(1, gz - iz));
      const i00 = iz * (TERRAIN_SEG_X + 1) + ix;
      const i10 = i00 + 1;
      const i01 = i00 + TERRAIN_SEG_X + 1;
      const i11 = i01 + 1;
      const top = heights[i00] * (1 - fx) + heights[i10] * fx;
      const bottom = heights[i01] * (1 - fx) + heights[i11] * fx;
      return top * (1 - fz) + bottom * fz;
    },
    [heights],
  );

  /** Compara la altura de la tierra con la superficie estimada del hueso. */
  const computeProgress = useCallback(() => {
    const [rx, rz] = specimen.spec.footprint;
    const [cx, , cz] = specimen.position;
    const samples = 18;
    let seen = 0;
    let total = 0;
    for (let iz = 0; iz < samples; iz += 1) {
      for (let ix = 0; ix < samples; ix += 1) {
        const nx = ((ix + 0.5) / samples) * 2 - 1;
        const nz = ((iz + 0.5) / samples) * 2 - 1;
        const r2 = nx * nx + nz * nz;
        if (r2 > 1) continue;
        total += 1;
        const wx = cx + nx * rx * specimen.scale;
        const wz = cz + nz * rz * specimen.scale;
        // El hueso es casi plano: solo baja un poco hacia el borde de la huella.
        const boneY = specimen.topY - 0.07 * (1 - Math.sqrt(1 - r2));
        if (sampleHeight(wx, wz) <= boneY + 0.012) seen += 1;
      }
    }
    return total > 0 ? seen / total : 0;
  }, [sampleHeight, specimen]);

  /* Nueva partida: volver a enterrar por completo. */
  useEffect(() => {
    const position = geometry.attributes.position as THREE.BufferAttribute;
    const color = geometry.attributes.color as THREE.BufferAttribute;
    for (let i = 0; i < heights.length; i += 1) {
      heights[i] = 0;
      position.setY(i, 0);
      color.setXYZ(i, 1, 1, 1);
    }
    position.needsUpdate = true;
    color.needsUpdate = true;
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    lastReported.current = -1;
    onProgress(0);
  }, [geometry, heights, specimen, onProgress]);

  useEffect(() => {
    const stop = () => {
      dragging.current = false;
    };
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
    return () => {
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
    };
  }, []);

  useFrame((_, delta) => {
    if (!enabled || queue.current.length === 0) return;

    const strokes = queue.current.splice(0, 12);
    if (queue.current.length > 24) queue.current.length = 0;
    const position = geometry.attributes.position as THREE.BufferAttribute;
    const color = geometry.attributes.color as THREE.BufferAttribute;
    let dirty = false;

    for (const stroke of strokes) {
      const { radius, strength, dust } = TOOL_SETTINGS[stroke.tool];
      const amount = strength * Math.min(1.6, delta * 60);
      const radiusSq = radius * radius;

      for (let i = 0; i < heights.length; i += 1) {
        const dx = xs[i] - stroke.x;
        const dz = zs[i] - stroke.z;
        const distanceSq = dx * dx + dz * dz;
        if (distanceSq > radiusSq) continue;

        const t = 1 - Math.sqrt(distanceSq) / radius;
        const weight = t * t * (3 - 2 * t);
        const next = Math.max(-MAX_DEPTH, heights[i] - amount * weight);
        if (next === heights[i]) continue;

        heights[i] = next;
        position.setY(i, next);
        const depth = Math.min(1, -next / MAX_DEPTH);
        tempColor.copy(sand).lerp(moist, depth * 0.85);
        color.setXYZ(i, tempColor.r, tempColor.g, tempColor.b);
        dirty = true;
      }
      dustApi.current.emit?.(stroke.x, stroke.z, dust);
    }

    if (!dirty) return;
    position.needsUpdate = true;
    color.needsUpdate = true;
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();

    const now = performance.now();
    if (now - lastCheck.current > 120) {
      lastCheck.current = now;
      const progress = computeProgress();
      if (Math.abs(progress - lastReported.current) > 0.004) {
        lastReported.current = progress;
        onProgress(progress);
      }
    }
  });

  const pushPoint = (event: ThreeEvent<PointerEvent>) => {
    if (!enabled || queue.current.length >= 24) return;
    queue.current.push({ x: event.point.x, z: event.point.z, tool });
  };

  const handleDown = (event: ThreeEvent<PointerEvent>) => {
    if (!enabled) return;
    event.stopPropagation();
    dragging.current = true;
    pushPoint(event);
  };

  const handleMove = (event: ThreeEvent<PointerEvent>) => {
    if (!enabled || !dragging.current) return;
    pushPoint(event);
  };

  return (
    <>
      <mesh receiveShadow geometry={geometry}>
        <meshStandardMaterial
          map={maps.map}
          normalMap={maps.normalMap}
          normalScale={normalScale}
          roughnessMap={maps.roughnessMap}
          aoMap={maps.aoMap}
          vertexColors
          roughness={0.95}
          metalness={0}
        />
      </mesh>

      {/* Plano invisible de raycasting: no depende de la malla deformada. */}
      <mesh
        position={[0, 0.04, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={() => {
          dragging.current = false;
        }}
        onPointerLeave={() => {
          dragging.current = false;
        }}
      >
        <planeGeometry args={[BED_WIDTH, BED_DEPTH]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}
