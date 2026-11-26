'use client';

import { useRef, type MutableRefObject, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { computeFraming, type FramingOptions, type FramingResult } from '@/lib/framing';

/** Subconjunto de la API de OrbitControls que necesita el rig. */
interface OrbitLike {
  target: THREE.Vector3;
  update: () => void;
}

export interface AutoFrameRigProps {
  /** Grupo que contiene únicamente la figura a encuadrar (sin luces ni sombras). */
  targetRef: RefObject<THREE.Object3D | null>;
  zoomRef: MutableRefObject<number>;
  options?: Omit<FramingOptions, 'fov' | 'aspect'>;
  /** Si se usa OrbitControls, su `target` se coloca en el centro de la figura. */
  controlsRef?: RefObject<OrbitLike | null>;
  /**
   * `false` solo recalcula near/far y centra la mirada; se usa para el fondo
   * de pterodáctilos, cuya cámara tiene una distancia fija deliberada.
   */
  fit?: boolean;
}

/**
 * Encuadre automático dentro de un `<Canvas>`:
 *  - calcula `Box3` + `boundingSphere` al cargar y al redimensionar,
 *  - centra la cámara (o el `target` de OrbitControls) en la figura,
 *  - ajusta `near`/`far` al radio y al zoom máximo,
 *  - interpola la distancia para que la figura nunca se corte.
 */
export default function AutoFrameRig({
  targetRef,
  zoomRef,
  options,
  controlsRef,
  fit = true,
}: AutoFrameRigProps) {
  const { camera, size } = useThree();
  const framing = useRef<FramingResult | null>(null);
  const signature = useRef('');

  useFrame(() => {
    const object = targetRef.current;
    if (!object) return;

    const nextSignature = `${size.width}x${size.height}`;
    if (!framing.current || signature.current !== nextSignature) {
      const perspective = camera as THREE.PerspectiveCamera;
      framing.current = computeFraming(object, {
        ...options,
        fov: perspective.isPerspectiveCamera ? perspective.fov : 45,
        aspect: size.width / Math.max(size.height, 1),
      });
      signature.current = nextSignature;

      if (perspective.isPerspectiveCamera) {
        perspective.near = framing.current.near;
        perspective.far = framing.current.far;
        perspective.updateProjectionMatrix();
      }
    }

    const frame = framing.current;
    const controls = controlsRef?.current;

    if (controls) {
      controls.target.copy(frame.center);
      controls.update();
    } else {
      camera.lookAt(frame.center);
    }

    if (fit) {
      const desired = frame.center
        .clone()
        .addScaledVector(frame.direction, frame.distance * zoomRef.current);
      camera.position.lerp(desired, 0.14);
    }
  });

  return null;
}
