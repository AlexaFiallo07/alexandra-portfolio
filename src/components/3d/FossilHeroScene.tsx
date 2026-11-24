'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/** Color del hueso fósil (piedra caliza envejecida). */
const BONE = '#C2B9A7';
const BONE_DARK = '#9E9482';
const HORN = '#8A7F6B';
const VOID = '#14150F';

/* ------------------------------------------------------------------ */
/*  Cráneo fósil feroz — estilo museo naturalista                      */
/* ------------------------------------------------------------------ */

function Skull() {
  // Fila de dientes superiores (más largos y afilados)
  const upperTeeth = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        x: 0.36 + i * 0.17,
        s: 1 - i * 0.06,
      })),
    [],
  );

  // Fila de dientes inferiores
  const lowerTeeth = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        x: 0.52 + i * 0.17,
        s: 0.9 - i * 0.06,
      })),
    [],
  );

  // Bultos óseos del hocico (textura de hueso erosionado)
  const bumps = useMemo(
    () => [
      [0.7, 0.24, 0.2],
      [0.95, 0.2, -0.22],
      [1.2, 0.14, 0.15],
      [0.55, 0.3, -0.18],
    ],
    [],
  );

  return (
    <group scale={1.05}>
      {/* ---------- Cráneo superior ---------- */}
      {/* Caja craneal alargada */}
      <mesh position={[-0.22, 0.2, 0]} scale={[1.12, 0.8, 0.74]}>
        <sphereGeometry args={[0.9, 48, 48]} />
        <meshStandardMaterial color={BONE} roughness={0.9} metalness={0.03} />
      </mesh>

      {/* Cresta sagital (hueso elevado — aspecto feroz) */}
      <mesh position={[-0.3, 0.82, 0]} rotation={[0, 0, -0.12]} scale={[1, 0.55, 0.3]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial color={BONE_DARK} roughness={0.92} />
      </mesh>

      {/* Hocico superior (maxilar robusto) */}
      <mesh position={[0.74, 0.0, 0]} scale={[1.05, 0.5, 0.58]}>
        <sphereGeometry args={[0.76, 40, 40]} />
        <meshStandardMaterial color={BONE} roughness={0.9} metalness={0.03} />
      </mesh>

      {/* Punta del hocico */}
      <mesh position={[1.4, -0.08, 0]} scale={[0.72, 0.46, 0.54]}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial color={BONE_DARK} roughness={0.92} />
      </mesh>

      {/* Bultos óseos del hocico */}
      {bumps.map((p, i) => (
        <mesh key={`bump-${i}`} position={p as [number, number, number]} scale={0.11}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color={BONE_DARK} roughness={1} />
        </mesh>
      ))}

      {/* Cuencas oculares profundas con ámbar bioluminiscente */}
      {[-1, 1].map((side) => (
        <group key={`orbit-${side}`} position={[0.1, 0.28, side * 0.6]}>
          <mesh scale={[0.34, 0.34, 0.2]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color={VOID} roughness={1} />
          </mesh>
          <mesh scale={0.12} position={[0, 0, side * 0.12]}>
            <sphereGeometry args={[1, 24, 24]} />
            <meshStandardMaterial
              color="#6657E2"
              emissive="#8577F0"
              emissiveIntensity={2.6}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      {/* Cejas hastiformes + cuernos (agresivos) */}
      {[-1, 1].map((side) => (
        <group key={`brow-${side}`}>
          <mesh position={[0.12, 0.54, side * 0.44]} rotation={[0, 0, -0.22]}>
            <boxGeometry args={[0.66, 0.16, 0.3]} />
            <meshStandardMaterial color={BONE_DARK} roughness={0.92} />
          </mesh>
          {/* Cuerno sobre la ceja */}
          <mesh
            position={[0.1, 0.74, side * 0.4]}
            rotation={[side * 0.35, 0, -0.3]}
          >
            <coneGeometry args={[0.1, 0.34, 10]} />
            <meshStandardMaterial color={HORN} roughness={0.75} />
          </mesh>
        </group>
      ))}

      {/* Cuerno nasal */}
      <mesh position={[1.0, 0.3, 0]} rotation={[0, 0, -0.35]}>
        <coneGeometry args={[0.09, 0.28, 10]} />
        <meshStandardMaterial color={HORN} roughness={0.75} />
      </mesh>

      {/* Fenestra temporal trasera */}
      {[-1, 1].map((side) => (
        <mesh key={`fen-${side}`} position={[-0.76, 0.12, side * 0.48]} scale={[0.26, 0.32, 0.14]}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial color={VOID} roughness={1} />
        </mesh>
      ))}

      {/* Cuerno cuadratojugal trasero */}
      {[-1, 1].map((side) => (
        <mesh
          key={`qj-${side}`}
          position={[-0.62, -0.1, side * 0.52]}
          rotation={[side * 0.7, 0, 0.9]}
        >
          <coneGeometry args={[0.07, 0.3, 8]} />
          <meshStandardMaterial color={HORN} roughness={0.8} />
        </mesh>
      ))}

      {/* ---------- Mandíbula inferior (boca abierta) ---------- */}
      <group position={[0.06, -0.56, 0]} rotation={[0, 0, -0.2]}>
        {/* Cuerpo de la mandíbula */}
        <mesh position={[0.7, 0, 0]}>
          <boxGeometry args={[2.0, 0.18, 0.5]} />
          <meshStandardMaterial color={BONE} roughness={0.9} />
        </mesh>
        {/* Articulación trasera */}
        <mesh position={[-0.36, 0.14, 0]} rotation={[0, 0, 0.5]}>
          <boxGeometry args={[0.32, 0.54, 0.46]} />
          <meshStandardMaterial color={BONE_DARK} roughness={0.9} />
        </mesh>
        {/* Mentón */}
        <mesh position={[1.66, 0.12, 0]}>
          <boxGeometry args={[0.24, 0.32, 0.48]} />
          <meshStandardMaterial color={BONE_DARK} roughness={0.92} />
        </mesh>

        {/* Dientes inferiores (ambos lados) */}
        {lowerTeeth.map((t, i) => (
          <group key={`lt-${i}`}>
            <mesh position={[t.x, 0.18, 0.15]} scale={[t.s, t.s, t.s]}>
              <coneGeometry args={[0.05, 0.22, 8]} />
              <meshStandardMaterial color="#F5F1E8" roughness={0.5} />
            </mesh>
            <mesh position={[t.x, 0.18, -0.15]} scale={[t.s, t.s, t.s]}>
              <coneGeometry args={[0.05, 0.22, 8]} />
              <meshStandardMaterial color="#F5F1E8" roughness={0.5} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Dientes superiores (colgando del maxilar, ambos lados) */}
      {upperTeeth.map((t, i) => (
        <group key={`ut-${i}`}>
          <mesh position={[t.x, -0.34, 0.17]} rotation={[Math.PI, 0, 0]} scale={[t.s, t.s, t.s]}>
            <coneGeometry args={[0.058, 0.27, 8]} />
            <meshStandardMaterial color="#F5F1E8" roughness={0.5} />
          </mesh>
          <mesh position={[t.x, -0.34, -0.17]} rotation={[Math.PI, 0, 0]} scale={[t.s, t.s, t.s]}>
            <coneGeometry args={[0.058, 0.27, 8]} />
            <meshStandardMaterial color="#F5F1E8" roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Pterodáctilo volando en círculos alrededor de la vitrina           */
/* ------------------------------------------------------------------ */

interface PterosaurProps {
  radius: number;
  height: number;
  /** Revoluciones por segundo */
  speed: number;
  phase: number;
  scale: number;
}

function Pterosaur({ radius, height, speed, phase, scale }: PterosaurProps) {
  const flyer = useRef<THREE.Group>(null);
  const wingL = useRef<THREE.Group>(null);
  const wingR = useRef<THREE.Group>(null);

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useFrame((state) => {
    const g = flyer.current;
    if (!g) return;

    const t = reducedMotion ? phase : state.clock.elapsedTime * speed * Math.PI * 2 + phase;

    // Trayectoria circular
    g.position.set(
      Math.cos(t) * radius,
      height + Math.sin(t * 2.1) * 0.28,
      Math.sin(t) * radius,
    );
    // Orientación tangencial (modelo mira hacia +x)
    g.rotation.y = -t - Math.PI / 2;
    g.rotation.z = Math.sin(t * 2.1) * 0.12; // inclinación al virar

    // Aleteo
    const flap = reducedMotion ? 0.25 : Math.sin(state.clock.elapsedTime * 5.5 + phase * 3) * 0.55;
    if (wingL.current) wingL.current.rotation.x = flap;
    if (wingR.current) wingR.current.rotation.x = -flap;
  });

  const SKIN = '#4A4E46';

  return (
    <group ref={flyer} scale={scale}>
      {/* Cuerpo alargado */}
      <mesh scale={[1, 0.55, 0.5]}>
        <sphereGeometry args={[0.34, 20, 20]} />
        <meshStandardMaterial color={SKIN} roughness={0.95} flatShading />
      </mesh>

      {/* Cabeza + pico largo */}
      <mesh position={[0.4, 0.06, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.09, 0.62, 8]} />
        <meshStandardMaterial color={SKIN} roughness={0.95} />
      </mesh>
      {/* Cresta craneal */}
      <mesh position={[0.26, 0.16, 0]} rotation={[0, 0, -0.5]} scale={[1, 1, 0.25]}>
        <coneGeometry args={[0.1, 0.3, 6]} />
        <meshStandardMaterial color="#5A5F55" roughness={0.95} />
      </mesh>

      {/* Cola */}
      <mesh position={[-0.42, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.08, 0.4, 6]} />
        <meshStandardMaterial color={SKIN} roughness={0.95} />
      </mesh>

      {/* Ala izquierda */}
      <group ref={wingL} position={[0.05, 0.08, 0.12]}>
        <mesh position={[-0.05, 0, 0.5]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.5, 0.03, 1.0]} />
          <meshStandardMaterial color={SKIN} roughness={0.95} flatShading />
        </mesh>
        {/* Punta de ala */}
        <mesh position={[-0.12, 0, 1.05]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[0.26, 0.02, 0.34]} />
          <meshStandardMaterial color="#3C403A" roughness={0.95} />
        </mesh>
      </group>

      {/* Ala derecha */}
      <group ref={wingR} position={[0.05, 0.08, -0.12]}>
        <mesh position={[-0.05, 0, -0.5]}>
          <boxGeometry args={[0.5, 0.03, 1.0]} />
          <meshStandardMaterial color={SKIN} roughness={0.95} flatShading />
        </mesh>
        <mesh position={[-0.12, 0, -1.05]} rotation={[0, -0.3, 0]}>
          <boxGeometry args={[0.26, 0.02, 0.34]} />
          <meshStandardMaterial color="#3C403A" roughness={0.95} />
        </mesh>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Escena: pedestal, luces, pterodáctilos y rotación 360°             */
/* ------------------------------------------------------------------ */

function Exhibit() {
  const exhibit = useRef<THREE.Group>(null);

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useFrame((state, delta) => {
    const root = exhibit.current;
    if (!root) return;

    // Rotación 360° continua (respetando prefers-reduced-motion)
    if (!reducedMotion) {
      root.rotation.y += delta * 0.28;
    }

    // Parallax suave siguiendo el cursor del usuario
    const { x, y } = state.pointer;
    root.rotation.x = THREE.MathUtils.lerp(root.rotation.x, -y * 0.26, 0.055);
    root.position.x = THREE.MathUtils.lerp(root.position.x, x * 0.16, 0.055);
    root.position.y = THREE.MathUtils.lerp(root.position.y, 0.12 + y * 0.06, 0.055);
  });

  return (
    <>
      {/* Iluminación de vitrina de museo (tema claro) */}
      <ambientLight intensity={0.55} color="#FFFFFF" />
      <directionalLight position={[3.5, 5, 2.5]} intensity={1.5} color="#FFFDF8" />
      {/* Rim morado trasero */}
      <pointLight position={[-2.6, 1.4, -2.4]} intensity={26} color="#8577F0" distance={14} />
      {/* Relleno verde musgo */}
      <pointLight position={[2.2, -0.6, 2.8]} intensity={8} color="#2E8B62" distance={12} />

      <group ref={exhibit} position={[0, 0.12, 0]}>
        <Skull />

        {/* Pedestal de roca (base de museo) */}
        <mesh position={[0.1, -1.16, 0]}>
          <cylinderGeometry args={[1.1, 1.35, 0.38, 6]} />
          <meshStandardMaterial color="#1A1D1B" roughness={1} metalness={0} />
        </mesh>
        <mesh position={[0.1, -1.37, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 0.08, 48]} />
          <meshStandardMaterial color="#141715" roughness={1} />
        </mesh>

        {/* Anillo del escáner de vitrina */}
        <mesh position={[0.1, -0.94, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.18, 0.018, 10, 90]} />
          <meshStandardMaterial
            color="#6657E2"
            emissive="#8577F0"
            emissiveIntensity={1.8}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Sombra de contacto sobre la base */}
      <ContactShadows
        position={[0.1, -1.42, 0]}
        opacity={0.32}
        scale={9}
        blur={2.8}
        far={3}
        color="#3A3F38"
      />

      {/* Pterodáctilos volando */}
      <Pterosaur radius={2.6} height={1.7} speed={0.055} phase={0} scale={0.85} />
      <Pterosaur radius={3.2} height={2.3} speed={-0.04} phase={2.4} scale={0.6} />
      <Pterosaur radius={2.2} height={1.1} speed={0.07} phase={4.6} scale={0.45} />

      {/* Polvo suspendido de la excavación */}
      <Sparkles
        count={45}
        scale={[7, 5, 5]}
        position={[0, 0.4, 0]}
        size={2.6}
        speed={0.32}
        opacity={0.5}
        color="#6657E2"
      />
    </>
  );
}

/**
 * Vitrina 3D del hero: Canvas con el cráneo fósil interactivo
 * (rotación 360° + parallax de cursor) y pterodáctilos volando.
 */
export default function FossilHeroScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0.15, 7], fov: 40 }}
    >
      <Exhibit />
    </Canvas>
  );
}
