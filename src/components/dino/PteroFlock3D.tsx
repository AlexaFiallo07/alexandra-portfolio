'use client';

import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import AutoFrameRig from '@/components/3d/AutoFrameRig';

interface Flyer {
  depth: number;
  top: number;
  dur: number;
  delay: number;
  scale: number;
  opacity: number;
  color: string;
}

const FLYERS: Flyer[] = [
  { depth: 0.025, top: 14, dur: 44, delay: -8, scale: 1, opacity: 0.24, color: '#6A4DAB' },
  { depth: 0.045, top: 34, dur: 62, delay: -30, scale: 0.75, opacity: 0.2, color: '#3E9D7B' },
  { depth: 0.075, top: 54, dur: 50, delay: -18, scale: 1.15, opacity: 0.22, color: '#3A2370' },
  { depth: 0.035, top: 74, dur: 68, delay: -46, scale: 0.85, opacity: 0.2, color: '#2B775D' },
  { depth: 0.06, top: 90, dur: 56, delay: -22, scale: 1.05, opacity: 0.18, color: '#6A4DAB' },
];

/** Pterodáctilo low-poly con alas que aletean y acabado Studio Light. */
function Ptero3D({ color, opacity, scale, phase }: Omit<Flyer, 'depth' | 'top' | 'dur' | 'delay'> & { phase: number }) {
  const left = useRef<THREE.Mesh>(null);
  const right = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const flap = Math.sin(state.clock.elapsedTime * 3 + phase) * 0.5;
    if (left.current) left.current.rotation.z = -flap;
    if (right.current) right.current.rotation.z = flap;
  });

  const material = (
    <meshStandardMaterial color={color} roughness={0.5} metalness={0.15} transparent opacity={opacity} />
  );

  return (
    <group scale={scale}>
      {/* Alas */}
      <mesh ref={left} position={[-0.52, 0.05, 0]}>
        <boxGeometry args={[1.05, 0.055, 0.34]} />
        {material}
      </mesh>
      <mesh ref={right} position={[0.52, 0.05, 0]}>
        <boxGeometry args={[1.05, 0.055, 0.34]} />
        {material}
      </mesh>
      {/* Cuerpo y cuello */}
      <mesh scale={[0.5, 0.22, 0.22]}>
        <sphereGeometry args={[0.5, 14, 12]} />
        {material}
      </mesh>
      <mesh position={[0.32, 0.1, 0]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.08, 0.28, 4, 10]} />
        {material}
      </mesh>
      {/* Cabeza, cresta y pico */}
      <mesh position={[0.55, 0.2, 0]}>
        <sphereGeometry args={[0.16, 12, 10]} />
        {material}
      </mesh>
      <mesh position={[0.5, 0.36, 0]} rotation={[0, 0, -0.45]}>
        <coneGeometry args={[0.12, 0.34, 4]} />
        {material}
      </mesh>
      <mesh position={[0.82, 0.17, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.07, 0.42, 6]} />
        {material}
      </mesh>
      {/* Cola */}
      <mesh position={[-0.5, -0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.08, 0.6, 6]} />
        {material}
      </mesh>
    </group>
  );
}

/** Un solo Canvas con los cinco pterodáctilos en parallax (fondo de la página). */
function Flock() {
  const { viewport } = useThree();
  const refs = useRef<Array<THREE.Group | null>>([]);
  const boundsRef = useRef<THREE.Group>(null);
  const fixedZoom = useRef(1);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const scroll = typeof window === 'undefined' ? 0 : window.scrollY;
    const span = viewport.width * 1.5;

    FLYERS.forEach((flyer, i) => {
      const group = refs.current[i];
      if (!group) return;
      const progress = (((t / flyer.dur + flyer.delay / flyer.dur) % 1) + 1) % 1;
      group.position.x = -span / 2 + progress * span;
      group.position.y =
        viewport.height / 2 -
        (flyer.top / 100) * viewport.height -
        ((scroll * flyer.depth) % 140) / 42;
      group.rotation.y = Math.sin(t * 0.4 + i) * 0.12;
    });
  });

  return (
    <>
      {/* Volumen de vuelo estático: permite calcular Box3/esfera y near/far
          sin que el encuadre baile con el movimiento de las alas. */}
      <group ref={boundsRef}>
        <mesh visible={false}>
          <boxGeometry args={[22, 14, 2]} />
        </mesh>
      </group>
      <AutoFrameRig
        targetRef={boundsRef}
        zoomRef={fixedZoom}
        fit={false}
        options={{ padding: 0.1, mode: 'box' }}
      />

      {FLYERS.map((flyer, i) => (
        <group
          key={`flyer-${i}`}
          ref={(element) => {
            refs.current[i] = element;
          }}
        >
          <Ptero3D
            color={flyer.color}
            opacity={flyer.opacity}
            scale={flyer.scale}
            phase={i * 1.1}
          />
        </group>
      ))}
    </>
  );
}

export default function PteroFlock3D() {
  return (
    <Canvas
      dpr={[1, 1.25]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 10], fov: 45, near: 0.1, far: 80 }}
      className="h-full w-full"
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={1.5} color="#FFFFFF" />
      <directionalLight position={[3, 5, 5]} intensity={1.6} color="#FFFFFF" />
      <directionalLight position={[-3, 2, -3]} intensity={0.6} color="#EDE9FE" />
      <Flock />
    </Canvas>
  );
}
