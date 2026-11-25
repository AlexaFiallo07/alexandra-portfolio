'use client';

import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  useAnimations,
  useGLTF,
} from '@react-three/drei';
import * as THREE from 'three';
import ModelGate from '@/components/3d/ModelGate';
import { MODEL_CLIPS, MODEL_FILES, MODEL_PATHS } from '@/lib/modelFiles';
import { findClip, fitModel } from '@/lib/model3d';

interface FossilStudio3DProps {
  className?: string;
}

/** Cráneo fósil procedural: se usa hasta que exista fossil_skull.glb. */
function ProceduralSkull() {
  const root = useRef<THREE.Group>(null);
  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useFrame((state, delta) => {
    const group = root.current;
    if (!group) return;
    if (!reducedMotion) group.rotation.y += delta * 0.16;
    group.rotation.x = THREE.MathUtils.lerp(
      group.rotation.x,
      -state.pointer.y * 0.12,
      0.06,
    );
    group.position.x = THREE.MathUtils.lerp(
      group.position.x,
      state.pointer.x * 0.1,
      0.06,
    );
  });

  return (
    <group ref={root} position={[0, 0.05, 0]}>
      {/* Cráneo y hocico en hueso claro */}
      <mesh position={[-0.28, 0.2, 0]} scale={[0.78, 0.6, 0.55]}>
        <sphereGeometry args={[0.8, 24, 24]} />
        <meshStandardMaterial color="#F4F4F7" roughness={0.82} />
      </mesh>
      <mesh position={[0.68, 0.02, 0]} scale={[1.1, 0.32, 0.34]}>
        <sphereGeometry args={[0.62, 24, 24]} />
        <meshStandardMaterial color="#E8E8EE" roughness={0.86} />
      </mesh>
      <mesh position={[1.18, -0.06, 0]} scale={[0.42, 0.22, 0.26]}>
        <sphereGeometry args={[0.36, 18, 18]} />
        <meshStandardMaterial color="#F4F4F7" roughness={0.82} />
      </mesh>

      {/* Arcos cigomáticos y cresta ósea */}
      {[-1, 1].map((s) => (
        <mesh
          key={`zygomatic-${s}`}
          position={[0.2, -0.05, s * 0.4]}
          rotation={[s * 0.25, 0, -0.15]}
        >
          <capsuleGeometry args={[0.055, 0.72, 6, 10]} />
          <meshStandardMaterial color="#E8E8EE" roughness={0.88} />
        </mesh>
      ))}
      <mesh position={[-0.25, 0.62, 0]} scale={[0.7, 0.12, 0.5]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#D8D8E2" roughness={0.92} />
      </mesh>

      {/* Cuencas, conducto nasal y sutura */}
      {[-1, 1].map((s) => (
        <group key={`socket-${s}`} position={[0.12, 0.26, s * 0.32]}>
          <mesh scale={[1, 0.82, 0.42]}>
            <sphereGeometry args={[0.2, 18, 18]} />
            <meshStandardMaterial color="#18181B" roughness={1} />
          </mesh>
          <mesh position={[0.03, 0.02, s * 0.05]}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshStandardMaterial color="#7C3AED" roughness={0.45} metalness={0.2} />
          </mesh>
        </group>
      ))}
      <mesh position={[1.02, 0.16, 0]} rotation={[0, 0, 0.18]} scale={[1, 0.72, 0.5]}>
        <sphereGeometry args={[0.12, 14, 14]} />
        <meshStandardMaterial color="#18181B" roughness={1} />
      </mesh>
      {[
        [-0.48, 0.42, 0.35, 0.5],
        [0.36, 0.38, 0.28, -0.7],
        [-0.12, 0.52, 0.22, 0.9],
      ].map(([x, y, length, rotation], i) => (
        <mesh key={`suture-${i}`} position={[x, y, 0.29]} rotation={[0, 0, rotation]}>
          <boxGeometry args={[0.014, length, 0.008]} />
          <meshStandardMaterial color="#D8D8E2" roughness={1} />
        </mesh>
      ))}

      {/* Mandíbula y dientes fósiles */}
      <mesh position={[0.52, -0.38, 0]} rotation={[0, 0, -0.05]} scale={[1.05, 0.16, 0.29]}>
        <sphereGeometry args={[0.75, 20, 20]} />
        <meshStandardMaterial color="#E8E8EE" roughness={0.9} />
      </mesh>
      {Array.from({ length: 6 }, (_, i) => (
        <group key={`tooth-${i}`}>
          {[-1, 1].map((s) => (
            <mesh
              key={`tooth-${i}-${s}`}
              position={[0.32 + i * 0.16, -0.18, s * 0.16]}
              rotation={[Math.PI, 0, 0]}
              scale={1 - i * 0.06}
            >
              <coneGeometry args={[0.035, 0.16, 6]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.65} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/** Cráneo GLB con clip Idle opcional y seguimiento suave del cursor. */
function SkullGlb() {
  const root = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL_PATHS[MODEL_FILES.fossilSkull]);
  const { actions, names } = useAnimations(animations, root);
  const fit = useMemo(() => fitModel(scene, 1.9, -0.5, 'x'), [scene]);
  const idleName = useMemo(
    () => findClip(names, [MODEL_CLIPS.fossilSkull.idle]) ?? '',
    [names],
  );
  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useEffect(() => {
    const idle = idleName ? actions[idleName] : undefined;
    idle?.reset().fadeIn(0.4).play();
    return () => {
      idle?.fadeOut(0.2);
    };
  }, [actions, idleName]);

  useFrame((state, delta) => {
    const group = root.current;
    if (!group) return;
    if (!reducedMotion) group.rotation.y += delta * 0.12;
    group.rotation.x = THREE.MathUtils.lerp(
      group.rotation.x,
      -state.pointer.y * 0.1,
      0.06,
    );
  });

  return (
    <group ref={root}>
      <primitive object={scene} scale={fit.scale} position={fit.position} />
    </group>
  );
}

function Pedestal() {
  return (
    <>
      <mesh position={[0, -0.94, 0]}>
        <cylinderGeometry args={[1.05, 1.12, 0.08, 48]} />
        <meshStandardMaterial color="#D8D8E2" roughness={0.85} />
      </mesh>
      <mesh position={[0, -0.72, 0]}>
        <cylinderGeometry args={[0.76, 0.9, 0.36, 6]} />
        <meshStandardMaterial color="#F4F4F7" roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.52, 0]}>
        <cylinderGeometry args={[0.82, 0.82, 0.05, 48]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.45} metalness={0.1} />
      </mesh>
      <mesh position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.82, 0.016, 8, 64]} />
        <meshStandardMaterial
          color="#7C3AED"
          emissive="#7C3AED"
          emissiveIntensity={0.5}
          metalness={0.4}
          roughness={0.35}
        />
      </mesh>
    </>
  );
}

function Scene({ glb }: { glb: boolean }) {
  return (
    <>
      <ambientLight intensity={0.78} color="#FFFFFF" />
      <hemisphereLight args={['#FFFFFF', '#D8D8E2', 0.55]} />
      <directionalLight position={[3, 4, 3]} intensity={1.45} color="#FFFFFF" />
      <directionalLight position={[-2.5, 2, -1]} intensity={0.5} color="#E8E2F5" />
      <pointLight position={[-2, 1.2, -1.8]} intensity={12} color="#7C3AED" distance={9} />
      <pointLight position={[1.8, 0.2, 2]} intensity={6} color="#10B981" distance={8} />

      {glb && (
        <Suspense fallback={null}>
          <Environment preset="studio" />
        </Suspense>
      )}

      <group position={[0, -0.1, 0]}>
        {glb ? <SkullGlb /> : <ProceduralSkull />}
        <Pedestal />
      </group>

      <ContactShadows
        position={[0, -1.02, 0]}
        opacity={0.16}
        scale={6}
        blur={2.6}
        far={2.5}
        color="#5B21B6"
      />
    </>
  );
}

/** Vitrina del fósil: GLB si está disponible, cráneo procedural si no. */
export default function FossilStudio3D({ className }: FossilStudio3DProps) {
  const canvasProps = {
    dpr: [1, 1.75] as [number, number],
    gl: { antialias: true, alpha: true },
    camera: { position: [0, 0.35, 4.6] as [number, number, number], fov: 38 },
    className,
  };

  const procedural = (
    <Canvas {...canvasProps}>
      <Scene glb={false} />
    </Canvas>
  );

  const withGlb = (
    <Canvas {...canvasProps}>
      <Suspense fallback={null}>
        <Scene glb />
      </Suspense>
    </Canvas>
  );

  return (
    <ModelGate
      file={MODEL_FILES.fossilSkull}
      fallback={procedural}
      label="Cargando fósil GLB…"
    >
      {withGlb}
    </ModelGate>
  );
}
