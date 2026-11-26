'use client';

import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  useAnimations,
  useGLTF,
} from '@react-three/drei';
import * as THREE from 'three';
import AutoFrameRig from '@/components/3d/AutoFrameRig';
import ModelGate from '@/components/3d/ModelGate';
import ZoomControls from '@/components/3d/ZoomControls';
import { useCameraZoom } from '@/lib/cameraZoom';
import { MODEL_CLIPS, MODEL_FILES, MODEL_PATHS } from '@/lib/modelFiles';
import { findClip, fitModel } from '@/lib/model3d';
import { useSpin360 } from '@/lib/spin360';
import { cn } from '@/lib/utils';

interface FossilStudio3DProps {
  className?: string;
}

/** Hueso con acabado de vitrina: mate con un brillo metálico muy sutil. */
function BoneMat({ color = '#F6F3FB', roughness = 0.72 }: { color?: string; roughness?: number }) {
  return <meshStandardMaterial color={color} roughness={roughness} metalness={0.08} />;
}

/** Cráneo fósil procedural: se usa hasta que exista fossil_skull.glb. */
function ProceduralSkull({ spinSignal = 0 }: { spinSignal?: number }) {
  const root = useRef<THREE.Group>(null);
  const lastSpin = useRef(0);
  const { triggerSpin, spinOffset } = useSpin360();
  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useEffect(() => {
    if (spinSignal > lastSpin.current) {
      lastSpin.current = spinSignal;
      triggerSpin();
    }
  }, [spinSignal, triggerSpin]);

  useFrame((state) => {
    const group = root.current;
    if (!group) return;
    const now = performance.now() / 1000;
    /* Antes giraba solo; ahora el giro 360° lo decide el clic. */
    group.rotation.y = spinOffset(now);
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
    <group
      ref={root}
      position={[0, 0.05, 0]}
      onPointerDown={(event) => {
        event.stopPropagation();
        if (!reducedMotion) triggerSpin();
      }}
    >
      {/* Cráneo y hocico en hueso claro */}
      <mesh position={[-0.28, 0.2, 0]} scale={[0.78, 0.6, 0.55]}>
        <sphereGeometry args={[0.8, 24, 24]} />
        <BoneMat />
      </mesh>
      <mesh position={[0.68, 0.02, 0]} scale={[1.1, 0.32, 0.34]}>
        <sphereGeometry args={[0.62, 24, 24]} />
        <BoneMat color="#EFEAF7" roughness={0.78} />
      </mesh>
      <mesh position={[1.18, -0.06, 0]} scale={[0.42, 0.22, 0.26]}>
        <sphereGeometry args={[0.36, 18, 18]} />
        <BoneMat />
      </mesh>

      {/* Arcos cigomáticos y cresta ósea */}
      {[-1, 1].map((s) => (
        <mesh
          key={`zygomatic-${s}`}
          position={[0.2, -0.05, s * 0.4]}
          rotation={[s * 0.25, 0, -0.15]}
        >
          <capsuleGeometry args={[0.055, 0.72, 6, 10]} />
          <BoneMat color="#EFEAF7" roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[-0.25, 0.62, 0]} scale={[0.7, 0.12, 0.5]}>
        <boxGeometry args={[1, 1, 1]} />
        <BoneMat color="#E4DCF1" roughness={0.86} />
      </mesh>

      {/* Cuencas, conducto nasal y sutura */}
      {[-1, 1].map((s) => (
        <group key={`socket-${s}`} position={[0.12, 0.26, s * 0.32]}>
          <mesh scale={[1, 0.82, 0.42]}>
            <sphereGeometry args={[0.2, 18, 18]} />
            <meshStandardMaterial color="#1F1433" roughness={1} />
          </mesh>
          <mesh position={[0.03, 0.02, s * 0.05]}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshStandardMaterial
              color="#6A4DAB"
              emissive="#6A4DAB"
              emissiveIntensity={0.35}
              roughness={0.4}
              metalness={0.25}
            />
          </mesh>
        </group>
      ))}
      <mesh position={[1.02, 0.16, 0]} rotation={[0, 0, 0.18]} scale={[1, 0.72, 0.5]}>
        <sphereGeometry args={[0.12, 14, 14]} />
        <meshStandardMaterial color="#1F1433" roughness={1} />
      </mesh>
      {[
        [-0.48, 0.42, 0.35, 0.5],
        [0.36, 0.38, 0.28, -0.7],
        [-0.12, 0.52, 0.22, 0.9],
      ].map(([x, y, length, rotation], i) => (
        <mesh key={`suture-${i}`} position={[x, y, 0.29]} rotation={[0, 0, rotation]}>
          <boxGeometry args={[0.014, length, 0.008]} />
          <BoneMat color="#E4DCF1" roughness={0.9} />
        </mesh>
      ))}

      {/* Mandíbula y dientes fósiles */}
      <mesh position={[0.52, -0.38, 0]} rotation={[0, 0, -0.05]} scale={[1.05, 0.16, 0.29]}>
        <sphereGeometry args={[0.75, 20, 20]} />
        <BoneMat color="#EFEAF7" roughness={0.8} />
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
              <BoneMat color="#FFFFFF" roughness={0.55} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/** Cráneo GLB con clip Idle opcional y giro 360° al pulsar. */
function SkullGlb({ spinSignal = 0 }: { spinSignal?: number }) {
  const root = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL_PATHS[MODEL_FILES.fossilSkull]);
  const { actions, names } = useAnimations(animations, root);
  const fit = useMemo(() => fitModel(scene, 1.9, -0.5, 'x'), [scene]);
  const idleName = useMemo(
    () => findClip(names, [MODEL_CLIPS.fossilSkull.idle]) ?? '',
    [names],
  );
  const lastSpin = useRef(0);
  const { triggerSpin, spinOffset } = useSpin360();
  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  /* Mismo acabado de hueso que la versión procedural. */
  useEffect(() => {
    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      for (const material of materials) {
        if (!(material instanceof THREE.MeshStandardMaterial)) continue;
        const light = material.color.r + material.color.g + material.color.b > 1.6;
        material.roughness = light ? 0.72 : 0.55;
        material.metalness = light ? 0.08 : 0.3;
        material.needsUpdate = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    if (spinSignal > lastSpin.current) {
      lastSpin.current = spinSignal;
      triggerSpin();
    }
  }, [spinSignal, triggerSpin]);

  useEffect(() => {
    const idle = idleName ? actions[idleName] : undefined;
    idle?.reset().fadeIn(0.4).play();
    return () => {
      idle?.fadeOut(0.2);
    };
  }, [actions, idleName]);

  useFrame((state) => {
    const group = root.current;
    if (!group) return;
    group.rotation.y = spinOffset(performance.now() / 1000);
    group.rotation.x = THREE.MathUtils.lerp(
      group.rotation.x,
      -state.pointer.y * 0.1,
      0.06,
    );
  });

  return (
    <group
      ref={root}
      onPointerDown={(event) => {
        event.stopPropagation();
        if (!reducedMotion) triggerSpin();
      }}
    >
      <primitive object={scene} scale={fit.scale} position={fit.position} />
    </group>
  );
}

function Pedestal() {
  return (
    <>
      <mesh position={[0, -0.94, 0]}>
        <cylinderGeometry args={[1.05, 1.12, 0.08, 48]} />
        <meshStandardMaterial color="#E4DCF1" roughness={0.85} />
      </mesh>
      <mesh position={[0, -0.72, 0]}>
        <cylinderGeometry args={[0.76, 0.9, 0.36, 6]} />
        <meshStandardMaterial color="#F6F3FB" roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.52, 0]}>
        <cylinderGeometry args={[0.82, 0.82, 0.05, 48]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.45} metalness={0.1} />
      </mesh>
      <mesh position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.82, 0.016, 8, 64]} />
        <meshStandardMaterial
          color="#6A4DAB"
          emissive="#6A4DAB"
          emissiveIntensity={0.5}
          metalness={0.4}
          roughness={0.35}
        />
      </mesh>
    </>
  );
}

function Scene({
  glb,
  spinSignal,
  zoomRef,
}: {
  glb: boolean;
  spinSignal: number;
  zoomRef: MutableRefObject<number>;
}) {
  const frameRef = useRef<THREE.Group>(null);
  return (
    <>
      <ambientLight intensity={0.78} color="#FFFFFF" />
      <hemisphereLight args={['#FFFFFF', '#E4DCF1', 0.55]} />
      <directionalLight position={[3, 4, 3]} intensity={1.45} color="#FFFFFF" />
      <directionalLight position={[-2.5, 2, -1]} intensity={0.5} color="#E8E2F5" />
      <pointLight position={[-2, 1.2, -1.8]} intensity={12} color="#6A4DAB" distance={9} />
      <pointLight position={[1.8, 0.2, 2]} intensity={6} color="#3E9D7B" distance={8} />

      {glb && (
        <Suspense fallback={null}>
          <Environment preset="studio" />
        </Suspense>
      )}

      <group ref={frameRef} position={[0, -0.1, 0]}>
        {glb ? <SkullGlb spinSignal={spinSignal} /> : <ProceduralSkull spinSignal={spinSignal} />}
        <Pedestal />
      </group>
      <AutoFrameRig targetRef={frameRef} zoomRef={zoomRef} options={{ padding: 0.16 }} />

      <ContactShadows
        position={[0, -1.02, 0]}
        opacity={0.16}
        scale={6}
        blur={2.6}
        far={2.5}
        color="#3A2370"
      />
    </>
  );
}

/** Vitrina del fósil: GLB si está disponible, cráneo procedural si no. */
export default function FossilStudio3D({ className }: FossilStudio3DProps) {
  const [spinSignal, setSpinSignal] = useState(0);
  const spin = () => setSpinSignal((value) => value + 1);
  const containerRef = useRef<HTMLDivElement>(null);
  const { zoom, zoomRef, zoomIn, zoomOut, reset } = useCameraZoom(containerRef);

  const canvasProps = {
    dpr: [1, 1.75] as [number, number],
    gl: { antialias: true, alpha: true },
    camera: { position: [0, 0.35, 4.6] as [number, number, number], fov: 38, near: 0.1, far: 60 },
    className: 'h-full w-full',
  };

  const procedural = (
    <Canvas {...canvasProps}>
      <Scene glb={false} spinSignal={spinSignal} zoomRef={zoomRef} />
    </Canvas>
  );

  const withGlb = (
    <Canvas {...canvasProps}>
      <Suspense fallback={null}>
        <Scene glb spinSignal={spinSignal} zoomRef={zoomRef} />
      </Suspense>
    </Canvas>
  );

  return (
    <div
      ref={containerRef}
      role="button"
      tabIndex={0}
      aria-label="Girar el fósil 360°"
      onClick={spin}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          spin();
        }
      }}
      className={cn(
        'relative h-full w-full cursor-pointer select-none [perspective:900px] focus:outline-none focus-visible:ring-2 focus-visible:ring-studio-purple',
        className,
      )}
    >
      <ModelGate
        file={MODEL_FILES.fossilSkull}
        fallback={procedural}
        label="Cargando fósil GLB…"
      >
        {withGlb}
      </ModelGate>
      <ZoomControls
        zoom={zoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={reset}
        label="Zoom del fósil"
      />
    </div>
  );
}
