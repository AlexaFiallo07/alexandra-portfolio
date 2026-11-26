'use client';

import { useMemo, useRef, type MutableRefObject, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSpin360 } from './spin360';

interface Vec2Ref {
  current: { x: number; y: number };
}

interface DinoMotionOptions {
  selected: boolean;
  dragging: boolean;
  dragDelta: Vec2Ref;
  pointerNorm: Vec2Ref;
  spinSignal?: number;
  root: RefObject<THREE.Group | null>;
  body?: RefObject<THREE.Mesh | null>;
  head?: RefObject<THREE.Group | null>;
  tail?: RefObject<THREE.Group | null>;
  limbA?: RefObject<THREE.Group | null>;
  limbB?: RefObject<THREE.Group | null>;
  pupils?: Array<RefObject<THREE.Mesh | null>>;
  jaw?: RefObject<THREE.Group | null>;
  prop?: RefObject<THREE.Group | null>;
  /** Orientación inicial en Y (radianes). */
  baseY?: number;
  /** Velocidad de auto-rotación en reposo. */
  autoSpeed?: number;
  /** Amplitud de la respiración (posición Y). */
  breathe?: number;
  /** Si el accesorio se acerca a la boca al seleccionar (taza de café). */
  propSip?: boolean;
}

const lerp = THREE.MathUtils.lerp;
const clamp = THREE.MathUtils.clamp;

/**
 * Movimiento "de vitrina de estudio" compartido con el T-Rex del hero:
 * auto-rotación, selección/arrastre, respiración, pupilas reactivas,
 * cola y extremidades vivas. El giro 360° se suma al final para que no
 * pelee con la orientación que marca el cursor.
 */
export function useDinoMotion({
  selected,
  dragging,
  dragDelta,
  pointerNorm,
  spinSignal = 0,
  root,
  body,
  head,
  tail,
  limbA,
  limbB,
  pupils,
  jaw,
  prop,
  baseY = -0.25,
  autoSpeed = 0.4,
  breathe = 0.035,
  propSip = false,
}: DinoMotionOptions) {
  const { triggerSpin, spinOffset } = useSpin360();
  const prevSpin = useRef(spinSignal);
  const currentRot = useRef({ x: 0.08, y: baseY });
  const targetRot = useRef({ x: 0.08, y: baseY });
  const targetPos = useRef({ x: 0, y: 0 });
  const baseBodyScale = useRef<THREE.Vector3 | null>(null);
  const basePropPos = useRef<THREE.Vector3 | null>(null);

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const now = performance.now() / 1000;
    const bodyRef = body;
    const headRef = head;
    const jawRef = jaw;
    const tailRef = tail;
    const limbARef = limbA;
    const limbBRef = limbB;
    const propRef = prop;

    if (spinSignal !== prevSpin.current) {
      triggerSpin();
      prevSpin.current = spinSignal;
    }

    const px = clamp(pointerNorm.current.x, -1, 1);
    const py = clamp(pointerNorm.current.y, -1, 1);

    if (dragging) {
      targetRot.current.y += dragDelta.current.x * 0.012;
      targetRot.current.x = clamp(targetRot.current.x + dragDelta.current.y * 0.009, -0.5, 0.5);
      targetPos.current.x = clamp(px * 0.5, -0.6, 0.6);
      targetPos.current.y = clamp(py * 0.3, -0.3, 0.35);
      dragDelta.current.x = 0;
      dragDelta.current.y = 0;
    } else if (selected) {
      targetRot.current.y = baseY + px * 1.25;
      targetRot.current.x = clamp(-py * 0.38, -0.4, 0.4);
      targetPos.current.x = px * 0.42;
      targetPos.current.y = py * 0.24;
    } else {
      if (!reducedMotion) targetRot.current.y += delta * autoSpeed;
      targetRot.current.x = lerp(targetRot.current.x, 0.08 - py * 0.08, 0.05);
      targetPos.current.x = lerp(targetPos.current.x, 0, 0.06);
      targetPos.current.y = lerp(targetPos.current.y, 0, 0.06);
    }

    if (root.current) {
      currentRot.current.y = lerp(currentRot.current.y, targetRot.current.y, 0.12);
      currentRot.current.x = lerp(currentRot.current.x, targetRot.current.x, 0.12);
      root.current.rotation.y = currentRot.current.y + spinOffset(now);
      root.current.rotation.x = currentRot.current.x;
      root.current.position.x = lerp(root.current.position.x, targetPos.current.x, 0.1);
      root.current.position.y = lerp(
        root.current.position.y,
        targetPos.current.y + Math.sin(t * 2.1) * breathe,
        0.1,
      );
    }

    const bodyObj = bodyRef?.current;
    if (bodyObj) {
      if (!baseBodyScale.current) baseBodyScale.current = bodyObj.scale.clone();
      const b = baseBodyScale.current;
      const s = 1 + Math.sin(t * 2.1) * 0.018;
      bodyObj.scale.set(b.x * s, b.y * s, b.z * s);
    }

    for (const pupil of pupils ?? []) {
      const pupilObj = pupil?.current;
      if (!pupilObj) continue;
      pupilObj.position.x = lerp(pupilObj.position.x, px * 0.04, 0.16);
      pupilObj.position.y = lerp(pupilObj.position.y, py * 0.028, 0.16);
    }

    const headObj = headRef?.current;
    if (headObj) {
      headObj.rotation.y = lerp(
        headObj.rotation.y,
        selected ? px * 0.24 : Math.sin(t * 1.1) * 0.04,
        0.08,
      );
      headObj.rotation.z = lerp(
        headObj.rotation.z,
        selected ? py * 0.12 : Math.sin(t * 1.5) * 0.03,
        0.08,
      );
    }

    const jawObj = jawRef?.current;
    if (jawObj) {
      const target = selected ? -0.11 + Math.sin(t * 4) * 0.04 : Math.sin(t * 2) * 0.025;
      jawObj.rotation.z = lerp(jawObj.rotation.z, target, 0.14);
    }

    const tailObj = tailRef?.current;
    if (tailObj) {
      tailObj.rotation.y = Math.sin(t * 2.8) * (selected ? 0.26 : 0.14);
      tailObj.rotation.z = Math.sin(t * 1.4) * 0.03;
    }

    const armA = limbARef?.current;
    if (armA) {
      armA.rotation.z = lerp(
        armA.rotation.z,
        Math.sin(t * 3.4) * 0.12 - (selected ? 0.08 : 0),
        0.12,
      );
    }
    const armB = limbBRef?.current;
    if (armB) {
      armB.rotation.z = lerp(
        armB.rotation.z,
        -Math.sin(t * 3.4 + 1.2) * 0.12 + (selected ? 0.08 : 0),
        0.12,
      );
    }

    const propObj = propRef?.current;
    if (propObj) {
      if (!basePropPos.current) basePropPos.current = propObj.position.clone();
      const base = basePropPos.current;
      propObj.rotation.z = Math.sin(t * 1.6) * 0.035;
      propObj.position.y = lerp(
        propObj.position.y,
        base.y + (propSip && selected ? 0.13 : 0),
        0.08,
      );
    }
  });
}
