'use client';

import { useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import GlbErrorBoundary from '@/components/3d/GlbErrorBoundary';
import { fitModel } from '@/lib/model3d';
import {
  createAmmoniteGeometry,
  createClawGeometry,
  createJawGeometry,
  createSpineGeometry,
} from './fossilGeometry';
import { getBoneMaps } from './textures';
import type { ExcavationPhase, FossilShape, Specimen } from './types';

interface FossilProps {
  specimen: Specimen;
  phase: ExcavationPhase;
  inspectDrag: RefObject<{ x: number; y: number }>;
}

function useBoneMaterial(): THREE.MeshStandardMaterial {
  const maps = useMemo(() => getBoneMaps(), []);
  return useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#B9A98D'),
        map: maps.map,
        normalMap: maps.normalMap,
        normalScale: new THREE.Vector2(0.8, 0.8),
        roughnessMap: maps.roughnessMap,
        aoMap: maps.aoMap,
        roughness: 0.86,
        metalness: 0.02,
      }),
    [maps],
  );
}

/** Cráneo de T-Rex esculpido con esferas suavizadas, mandíbula y dientes. */
function TRexSkull({ material, socket }: { material: THREE.Material; socket: THREE.Material }) {
  const jaw = useMemo(() => createJawGeometry(), []);
  const teeth = useMemo(() => Array.from({ length: 7 }, (_, i) => 0.02 + i * 0.09), []);
  return (
    <group rotation={[0, -0.18, 0]}>
      <mesh castShadow receiveShadow position={[-0.16, 0.06, 0]} scale={[0.46, 0.34, 0.36]} material={material}>
        <sphereGeometry args={[1, 32, 24]} />
      </mesh>
      <mesh castShadow position={[0.28, -0.02, 0]} scale={[0.42, 0.2, 0.26]} material={material}>
        <sphereGeometry args={[1, 28, 20]} />
      </mesh>
      <mesh castShadow geometry={jaw} material={material} />
      {[-0.22, 0.22].map((z) => (
        <group key={z} position={[-0.06, 0.16, z]}>
          <mesh scale={[1, 0.8, 0.55]} material={socket}>
            <sphereGeometry args={[0.11, 18, 14]} />
          </mesh>
          <mesh position={[0.01, 0, Math.sign(z) * 0.015]} rotation={[Math.PI / 2, 0, 0]} material={material}>
            <torusGeometry args={[0.105, 0.022, 8, 22]} />
          </mesh>
        </group>
      ))}
      {teeth.flatMap((x) =>
        [-1, 1].map((side) => (
          <mesh
            key={`${x}-${side}`}
            castShadow
            position={[x, -0.1, side * 0.2]}
            rotation={[0, 0, Math.PI]}
            material={material}
          >
            <coneGeometry args={[0.03, 0.14, 8]} />
          </mesh>
        )),
      )}
      {[-0.08, 0.08].map((z) => (
        <mesh key={z} position={[-0.28, 0.27, z]} scale={[0.16, 0.06, 0.08]} material={material}>
          <sphereGeometry args={[1, 16, 12]} />
        </mesh>
      ))}
    </group>
  );
}

/** Garra curvada con reborde óseo en la base. */
function RaptorClaw({ material }: { material: THREE.Material }) {
  const claw = useMemo(() => createClawGeometry(), []);
  return (
    <group rotation={[0, 0, -0.15]}>
      <mesh castShadow receiveShadow geometry={claw} material={material} />
      <mesh castShadow position={[0, -0.2, 0]} scale={[0.19, 0.13, 0.17]} material={material}>
        <sphereGeometry args={[1, 22, 16]} />
      </mesh>
      {Array.from({ length: 4 }, (_, i) => (
        <mesh
          key={i}
          castShadow
          position={[0.05 + i * 0.06, -0.16 + i * 0.025, 0]}
          rotation={[0, 0, -0.55]}
          material={material}
        >
          <coneGeometry args={[0.035, 0.13, 8]} />
        </mesh>
      ))}
    </group>
  );
}

/** Amonita en espiral con costillas. */
function Ammonite({ material }: { material: THREE.Material }) {
  const shell = useMemo(() => createAmmoniteGeometry(), []);
  return (
    <group rotation={[0.12, 0, 0]}>
      <mesh castShadow receiveShadow geometry={shell} material={material} />
      <mesh castShadow position={[0, 0.02, 0]} scale={[0.13, 0.07, 0.13]} material={material}>
        <sphereGeometry args={[1, 20, 16]} />
      </mesh>
    </group>
  );
}

/** Vértebra con cuerpo, apófisis espinosa y apófisis transversas. */
function Vertebra({ material }: { material: THREE.Material }) {
  const spine = useMemo(() => createSpineGeometry(), []);
  return (
    <group>
      <mesh castShadow receiveShadow scale={[0.3, 0.24, 0.28]} material={material}>
        <sphereGeometry args={[1, 28, 22]} />
      </mesh>
      <mesh castShadow geometry={spine} material={material} />
      <mesh position={[0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={material}>
        <cylinderGeometry args={[0.22, 0.22, 0.06, 24]} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          castShadow
          position={[0.02, 0.06, side * 0.25]}
          rotation={[side * 0.85, 0, 0]}
          scale={[0.1, 0.28, 0.1]}
          material={material}
        >
          <sphereGeometry args={[1, 18, 14]} />
        </mesh>
      ))}
    </group>
  );
}

function ProceduralFossil({
  shape,
  material,
  socket,
}: {
  shape: FossilShape;
  material: THREE.Material;
  socket: THREE.Material;
}) {
  switch (shape) {
    case 'trex':
      return <TRexSkull material={material} socket={socket} />;
    case 'claw':
      return <RaptorClaw material={material} />;
    case 'ammonite':
      return <Ammonite material={material} />;
    case 'vertebra':
      return <Vertebra material={material} />;
  }
}

/** Modelo GLB opcional, encuadrado con la misma convención que el resto del sitio. */
function GlbFossil({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const fit = useMemo(() => fitModel(scene, 2.1, -0.4, 'max'), [scene]);
  return <primitive object={scene} scale={fit.scale} position={fit.position} />;
}

/** Fósil semi-enterrado que emerge y se puede girar 360° al completar la excavación. */
export default function Fossil({ specimen, phase, inspectDrag }: FossilProps) {
  const group = useRef<THREE.Group>(null);
  const material = useBoneMaterial();
  const socket = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#3B2F28', roughness: 0.95 }),
    [],
  );
  const dusty = useMemo(() => new THREE.Color('#B9A98D'), []);
  const clean = useMemo(() => new THREE.Color('#F0E4CC'), []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    const targetY = phase === 'digging' ? specimen.position[1] : specimen.position[1] + 0.72;
    g.position.y = THREE.MathUtils.damp(g.position.y, targetY, 4, delta);

    const autoSpin = phase === 'inspecting' ? state.clock.elapsedTime * 0.16 : 0;
    const targetRotY = specimen.rotationY + autoSpin + inspectDrag.current.x;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetRotY, 7, delta);

    const targetRotX = phase === 'digging' ? 0 : THREE.MathUtils.clamp(inspectDrag.current.y, -0.6, 0.6);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetRotX, 6, delta);

    // Limpieza automática: el polvo marfil se aclara al emerging/inspecting.
    material.color.lerp(phase === 'digging' ? dusty : clean, 0.05);
  });

  const procedural = (
    <ProceduralFossil shape={specimen.spec.shape} material={material} socket={socket} />
  );

  return (
    <group ref={group} position={specimen.position} rotation={[0, specimen.rotationY, 0]} scale={specimen.scale}>
      {specimen.spec.glb ? (
        <GlbErrorBoundary fallback={procedural}>
          <GlbFossil url={specimen.spec.glb} />
        </GlbErrorBoundary>
      ) : (
        procedural
      )}
      {(phase === 'emerging' || phase === 'inspecting') && (
        <Sparkles count={28} scale={[1.3, 1.1, 1.3]} size={2.4} speed={0.45} color="#FFFFFF" />
      )}
    </group>
  );
}
