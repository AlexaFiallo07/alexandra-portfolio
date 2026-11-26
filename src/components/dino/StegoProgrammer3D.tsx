'use client';

import { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import AutoFrameRig from '@/components/3d/AutoFrameRig';
import { DINO_SKIN } from '@/components/3d/SkinMat';
import ZoomControls from '@/components/3d/ZoomControls';
import { useCameraZoom } from '@/lib/cameraZoom';
import { useStudioPointer } from '@/lib/dinoInteraction';
import { useDinoMotion } from '@/lib/dinoMotion';
import { cn } from '@/lib/utils';

const { skin, dark, belly, plate, claw } = DINO_SKIN;

const CODE = [
  { text: '</>', left: '8%', delay: '0s' },
  { text: '{ }', left: '22%', delay: '0.7s' },
  { text: 'def', left: '14%', delay: '1.3s' },
  { text: '200', left: '30%', delay: '1.9s' },
  { text: '=>', left: '5%', delay: '2.3s' },
];

interface StegoSceneProps {
  selected: boolean;
  dragging: boolean;
  dragDelta: { current: { x: number; y: number } };
  pointerNorm: { current: { x: number; y: number } };
  spinSignal: number;
}

/** Stegosaurus 3D con manos sobre el teclado y la misma vida del hero. */
function StegoScene({
  selected,
  dragging,
  dragDelta,
  pointerNorm,
  spinSignal,
}: StegoSceneProps) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const head = useRef<THREE.Group>(null);
  const jaw = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const laptop = useRef<THREE.Group>(null);
  const pupilL = useRef<THREE.Mesh>(null);
  const pupilR = useRef<THREE.Mesh>(null);

  useDinoMotion({
    selected,
    dragging,
    dragDelta,
    pointerNorm,
    spinSignal,
    root,
    body,
    head,
    jaw,
    tail,
    limbA: leftArm,
    limbB: rightArm,
    pupils: [pupilL, pupilR],
    prop: laptop,
    baseY: -0.38,
    autoSpeed: 0.42,
  });

  return (
    <group ref={root}>
      {/* Cuerpo y vientre */}
      <mesh ref={body} position={[-0.1, 0.12, 0]} scale={[1.12, 0.68, 0.64]}>
        <sphereGeometry args={[0.85, 28, 24]} />
        <meshStandardMaterial color={skin} roughness={0.44} metalness={0.14} />
      </mesh>
      <mesh position={[-0.05, -0.04, 0.3]} scale={[0.92, 0.4, 0.34]}>
        <sphereGeometry args={[0.8, 24, 20]} />
        <meshStandardMaterial color={belly} roughness={0.58} />
      </mesh>

      {/* Cola segmentada con punta morada */}
      <group ref={tail}>
        {Array.from({ length: 6 }, (_, i) => (
          <mesh
            key={`tail-${i}`}
            position={[-1 - i * 0.32, 0.1 - i * 0.025, 0]}
            scale={[1 - i * 0.11, 1 - i * 0.13, 1 - i * 0.13]}
          >
            <sphereGeometry args={[0.34, 16, 14]} />
            <meshStandardMaterial color={i % 2 ? dark : skin} roughness={0.5} />
          </mesh>
        ))}
        <mesh position={[-3.05, -0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.08, 0.45, 10]} />
          <meshStandardMaterial color={plate} roughness={0.35} metalness={0.5} />
        </mesh>
      </group>

      {/* Placas dorsales moradas */}
      {[-0.78, -0.38, 0.04, 0.44, 0.8].map((x, i) => (
        <mesh
          key={`plate-${x}`}
          position={[x, 0.72 + (i === 2 ? 0.09 : 0), 0]}
          scale={[1, 1, 0.6]}
        >
          <coneGeometry args={[0.27 - i * 0.015, 0.58, 4]} />
          <meshStandardMaterial
            color={plate}
            roughness={0.32}
            metalness={0.45}
            emissive={plate}
            emissiveIntensity={0.14}
          />
        </mesh>
      ))}

      {/* Cuatro patas */}
      {[-0.62, 0.48].flatMap((x) =>
        [-0.34, 0.34].map((z) => (
          <mesh key={`leg-${x}-${z}`} position={[x, -0.52, z]}>
            <capsuleGeometry args={[0.17, 0.42, 4, 12]} />
            <meshStandardMaterial color={dark} roughness={0.62} />
          </mesh>
        )),
      )}

      {/* Cabeza: mira al cursor y "habla" mientras teclea */}
      <group ref={head} position={[0.92, 0.32, 0.04]}>
        <mesh scale={[0.55, 0.44, 0.42]}>
          <sphereGeometry args={[0.8, 26, 22]} />
          <meshStandardMaterial color={skin} roughness={0.42} metalness={0.12} />
        </mesh>
        <mesh position={[0.4, -0.02, 0]} scale={[0.32, 0.21, 0.26]}>
          <sphereGeometry args={[0.8, 22, 18]} />
          <meshStandardMaterial color={belly} roughness={0.55} />
        </mesh>
        <group ref={jaw} position={[0.34, -0.16, 0]}>
          <mesh position={[0.08, -0.02, 0]} scale={[0.3, 0.12, 0.24]}>
            <sphereGeometry args={[0.8, 18, 14]} />
            <meshStandardMaterial color={belly} roughness={0.56} />
          </mesh>
        </group>
        <mesh position={[0.64, -0.04, 0]}>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshStandardMaterial color={claw} />
        </mesh>

        {[
          { z: -0.24, ref: pupilL },
          { z: 0.24, ref: pupilR },
        ].map(({ z, ref }) => (
          <group key={`eye-${z}`} position={[0.18, 0.13, z]}>
            <mesh>
              <sphereGeometry args={[0.13, 16, 16]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
            </mesh>
            <mesh ref={ref} position={[0, 0, Math.sign(z) * 0.012]}>
              <sphereGeometry args={[0.06, 14, 14]} />
              <meshStandardMaterial color={claw} />
            </mesh>
            <mesh position={[0.03, 0.035, Math.sign(z) * 0.02]}>
              <sphereGeometry args={[0.018, 8, 8]} />
              <meshBasicMaterial color="#FFFFFF" toneMapped={false} />
            </mesh>
          </group>
        ))}

        {/* Audífonos */}
        <mesh position={[-0.04, 0.2, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.4, 0.055, 10, 26]} />
          <meshStandardMaterial color={plate} metalness={0.62} roughness={0.28} />
        </mesh>
        {[-0.4, 0.4].map((z) => (
          <mesh key={`cup-${z}`} position={[-0.04, -0.02, z]}>
            <boxGeometry args={[0.18, 0.3, 0.13]} />
            <meshStandardMaterial color="#3A2370" metalness={0.5} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Brazos que llegan al teclado; se alternan como si teclearan */}
      <group ref={leftArm} position={[0.52, 0.16, 0.36]}>
        <mesh position={[0.24, -0.14, 0.08]} rotation={[0.5, 0, -0.95]}>
          <capsuleGeometry args={[0.11, 0.46, 4, 12]} />
          <meshStandardMaterial color={dark} roughness={0.54} />
        </mesh>
        <mesh position={[0.46, -0.3, 0.18]}>
          <sphereGeometry args={[0.11, 14, 12]} />
          <meshStandardMaterial color={skin} roughness={0.46} />
        </mesh>
      </group>
      <group ref={rightArm} position={[0.52, 0.16, -0.36]}>
        <mesh position={[0.24, -0.14, -0.08]} rotation={[-0.5, 0, -0.95]}>
          <capsuleGeometry args={[0.11, 0.46, 4, 12]} />
          <meshStandardMaterial color={dark} roughness={0.54} />
        </mesh>
        <mesh position={[0.46, -0.3, -0.18]}>
          <sphereGeometry args={[0.11, 14, 12]} />
          <meshStandardMaterial color={skin} roughness={0.46} />
        </mesh>
      </group>

      {/* Laptop de cara al espectador, con las manos apoyadas en el teclado */}
      <group ref={laptop} position={[1.02, -0.3, 0.62]} rotation={[0, -0.3, 0]}>
        <mesh>
          <boxGeometry args={[0.82, 0.06, 0.52]} />
          <meshStandardMaterial color="#EFEAF7" metalness={0.35} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.33, 0.22]} rotation={[0.24, 0, 0]}>
          <boxGeometry args={[0.8, 0.56, 0.05]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} metalness={0.15} />
        </mesh>
        <mesh position={[0, 0.33, 0.255]} rotation={[0.24, 0, 0]}>
          <planeGeometry args={[0.66, 0.44]} />
          <meshBasicMaterial color="#F6F3FB" toneMapped={false} />
        </mesh>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={`code-${i}`} position={[-0.12 + (i % 2) * 0.2, 0.44 - i * 0.09, 0.262]}>
            <boxGeometry args={[0.26 - i * 0.025, 0.024, 0.012]} />
            <meshBasicMaterial color={i % 2 ? plate : '#3E9D7B'} toneMapped={false} />
          </mesh>
        ))}
      </group>

      <Sparkles count={18} scale={[3.4, 2.2, 2]} size={2.6} speed={0.35} color={plate} />
    </group>
  );
}

/** Versión 3D del stegosaurus programador; gira 360°, se arrastra y tiene zoom. */
export default function StegoProgrammer3D({ className }: { className?: string }) {
  const frameRef = useRef<THREE.Group>(null);
  const [spinSignal, setSpinSignal] = useState(0);
  const spin = () => setSpinSignal((value) => value + 1);
  const { containerRef, selected, dragging, dragDelta, pointerNorm, onPointerDown, onKeyDownActivate } =
    useStudioPointer(spin);
  const { zoom, zoomRef, zoomIn, zoomOut, reset } = useCameraZoom(containerRef);

  return (
    <div
      ref={containerRef}
      role="button"
      tabIndex={0}
      aria-label="Seleccionar, arrastrar o girar el stegosaurus 360°"
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDownActivate}
      className={cn(
        'relative h-full w-full cursor-grab select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-studio-purple',
        dragging ? 'cursor-grabbing' : selected ? 'cursor-move' : '',
        className,
      )}
    >
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0.35, 5.4], fov: 42, near: 0.1, far: 80 }}
      >
        <ambientLight intensity={1.2} color="#FFFFFF" />
        <hemisphereLight args={['#FFFFFF', '#EFEAF7', 0.8]} />
        <directionalLight position={[4, 6, 5]} intensity={1.7} color="#FFFFFF" />
        <directionalLight position={[-4, 3, -3]} intensity={0.7} color="#EDE9FE" />
        <pointLight position={[2.4, 1.6, 2.6]} intensity={9} color="#3E9D7B" distance={12} />
        <pointLight position={[-2.6, 1.2, -2.2]} intensity={11} color="#6A4DAB" distance={12} />
        <Suspense fallback={null}>
          <Environment preset="studio" />
        </Suspense>

        <group ref={frameRef}>
          <StegoScene
            selected={selected}
            dragging={dragging}
            dragDelta={dragDelta}
            pointerNorm={pointerNorm}
            spinSignal={spinSignal}
          />
        </group>
        <AutoFrameRig targetRef={frameRef} zoomRef={zoomRef} options={{ padding: 0.16 }} />
        <ContactShadows
          position={[0, -1, 0]}
          opacity={0.2}
          scale={8}
          blur={2.6}
          far={3}
          color="#3A2370"
        />
      </Canvas>

      {/* Partículas de código sobre la laptop, como en la versión ilustrada */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
        {CODE.map((particle) => (
          <span
            key={particle.text}
            className="code-particle"
            style={{ left: particle.left, bottom: '12%', animationDelay: particle.delay }}
          >
            {particle.text}
          </span>
        ))}
      </div>

      <ZoomControls
        zoom={zoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={reset}
        className="bottom-2 right-2"
        label="Zoom del stegosaurus"
      />
    </div>
  );
}
