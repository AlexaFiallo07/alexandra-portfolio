'use client';

import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/* Colores: piel realista oliva + gafas dorado fósil */
const SKIN = '#5F6E49';
const SKIN_DARK = '#43502F';
const BELLY = '#B7B392';
const CLAW = '#26261F';
const GOLD = '#C4A35A';
const LENS = '#1F1433';

/**
 * Bust de T-Rex con gafas de desarrollador:
 * - las pupilas siguen el cursor del usuario
 * - al hacer clic ruge (abre la mandíbula y ladea la cabeza)
 * - rotación suave + parallax
 */
function TRexBust() {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const jaw = useRef<THREE.Group>(null);
  const pupilL = useRef<THREE.Mesh>(null);
  const pupilR = useRef<THREE.Mesh>(null);

  const roar = useRef<{ start: number } | null>(null);
  const [hovered, setHovered] = useState(false);

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const now = performance.now() / 1000;

    // ---------- Raíz: rotación 360 lenta + parallax de cursor ----------
    const rootGroup = root.current;
    if (rootGroup) {
      if (!reducedMotion) rootGroup.rotation.y += delta * 0.22;
      rootGroup.rotation.x = THREE.MathUtils.lerp(
        rootGroup.rotation.x,
        -state.pointer.y * 0.22,
        0.06,
      );
      rootGroup.position.x = THREE.MathUtils.lerp(
        rootGroup.position.x,
        state.pointer.x * 0.18,
        0.06,
      );
    }

    // ---------- Pupilas que siguen el cursor ----------
    const px = THREE.MathUtils.clamp(state.pointer.x, -1, 1) * 0.045;
    const py = THREE.MathUtils.clamp(state.pointer.y, -1, 1) * 0.035;
    for (const p of [pupilL.current, pupilR.current]) {
      if (!p) continue;
      p.position.x = THREE.MathUtils.lerp(p.position.x, 0.05 + px, 0.14);
      p.position.y = THREE.MathUtils.lerp(p.position.y, py, 0.14);
    }

    // ---------- Rugido al hacer clic ----------
    const jawGroup = jaw.current;
    const headGroup = head.current;
    if (jawGroup && headGroup) {
      if (roar.current) {
        const p = (now - roar.current.start) / 1.1;
        if (p >= 1) {
          roar.current = null;
          jawGroup.rotation.z = 0;
          headGroup.rotation.z = 0;
        } else {
          // Abrir → sostener → cerrar
          const open = Math.sin(Math.min(p * 1.35, 1) * Math.PI);
          jawGroup.rotation.z = -0.02 - open * 0.5;
          headGroup.rotation.z = open * 0.16;
          headGroup.position.y = 1.35 + open * 0.12;
        }
      } else {
        const breathe = Math.sin(t * 2.1) * 0.02;
        jawGroup.rotation.z = THREE.MathUtils.lerp(jawGroup.rotation.z, breathe, 0.08);
        headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, 0, 0.1);
        headGroup.position.y = THREE.MathUtils.lerp(headGroup.position.y, 1.35, 0.1);
      }
    }
  });

  /* Fila de dientes (arriba y abajo) */
  const teeth = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        x: 0.28 + i * 0.16,
        s: 1 - i * 0.07,
      })),
    [],
  );

  return (
    <group
      ref={root}
      onPointerDown={(e) => {
        e.stopPropagation();
        if (!reducedMotion) roar.current = { start: performance.now() / 1000 };
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* ---------- Cuello / busto ---------- */}
      <mesh position={[-0.55, 0.3, 0]} rotation={[0, 0, 0.5]} scale={[1, 1, 0.85]}>
        <cylinderGeometry args={[0.5, 0.95, 1.7, 14]} />
        <meshStandardMaterial color={SKIN_DARK} roughness={0.95} />
      </mesh>
      <mesh position={[-0.5, -0.5, 0]} scale={[1.2, 0.7, 1]}>
        <sphereGeometry args={[0.9, 24, 24]} />
        <meshStandardMaterial color={SKIN} roughness={0.95} />
      </mesh>

      {/* Franjas dorsales del cuello */}
      {[-0.15, -0.45, -0.75].map((y, i) => (
        <mesh key={`stripe-${i}`} position={[-0.62 - i * 0.08, y + 0.55, 0]} scale={[1, 0.4, 1.15]}>
          <sphereGeometry args={[0.34 - i * 0.03, 12, 12]} />
          <meshStandardMaterial color={SKIN_DARK} roughness={1} />
        </mesh>
      ))}

      {/* ---------- Cabeza ---------- */}
      <group ref={head} position={[0, 1.35, 0]}>
        {/* Cráneo */}
        <mesh scale={[1.25, 0.9, 0.9]}>
          <sphereGeometry args={[0.62, 32, 32]} />
          <meshStandardMaterial color={SKIN} roughness={0.92} />
        </mesh>

        {/* Hocico superior */}
        <mesh position={[0.78, -0.1, 0]} scale={[1.35, 0.62, 0.72]}>
          <sphereGeometry args={[0.5, 28, 28]} />
          <meshStandardMaterial color={SKIN} roughness={0.92} />
        </mesh>
        {/* Punta del hocico */}
        <mesh position={[1.32, -0.16, 0]} scale={[0.7, 0.5, 0.6]}>
          <sphereGeometry args={[0.32, 20, 20]} />
          <meshStandardMaterial color={SKIN_DARK} roughness={0.95} />
        </mesh>
        {/* Narinas */}
        {[-1, 1].map((s) => (
          <mesh key={`nostril-${s}`} position={[1.4, -0.05, s * 0.14]} scale={[1, 0.7, 1]}>
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshStandardMaterial color={CLAW} roughness={1} />
          </mesh>
        ))}

        {/* Ceja feroz (hueso sobre el ojo) */}
        {[-1, 1].map((s) => (
          <mesh key={`brow-${s}`} position={[0.3, 0.3, s * 0.36]} rotation={[0, 0, -0.16]}>
            <boxGeometry args={[0.5, 0.14, 0.3]} />
            <meshStandardMaterial color={SKIN_DARK} roughness={0.95} />
          </mesh>
        ))}

        {/* ---------- Ojos + pupilas que siguen el cursor ---------- */}
        {[
          { s: 1, ref: pupilL },
          { s: -1, ref: pupilR },
        ].map(({ s, ref }) => (
          <group key={`eye-${s}`} position={[0.34, 0.12, s * 0.4]}>
            <mesh>
              <sphereGeometry args={[0.13, 20, 20]} />
              <meshStandardMaterial color="#F2EFE4" roughness={0.35} />
            </mesh>
            <mesh ref={ref} position={[0.05, 0, 0]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial color={hovered ? '#A98FD6' : '#14150F'} roughness={0.25} />
            </mesh>
            <mesh position={[0.07, 0.03, s * 0.03]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial color="#FFFFFF" toneMapped={false} />
            </mesh>
          </group>
        ))}

        {/* ---------- Gafas de desarrollador ---------- */}
        <group position={[0.34, 0.12, 0]}>
          {/* Lentes (dos paneles redondeados) */}
          {[-1, 1].map((s) => (
            <mesh key={`lens-${s}`} position={[0.06, 0, s * 0.42]} scale={[1, 0.78, 1]}>
              <boxGeometry args={[0.34, 0.3, 0.05]} />
              <meshStandardMaterial
                color={LENS}
                roughness={0.15}
                metalness={0.35}
                transparent
                opacity={0.82}
              />
            </mesh>
          ))}
          {/* Marco de las lentes */}
          {[-1, 1].map((s) => (
            <mesh key={`frame-${s}`} position={[0.06, 0, s * 0.42]}>
              <torusGeometry args={[0.21, 0.028, 10, 4]} />
              <meshStandardMaterial
                color={GOLD}
                emissive={GOLD}
                emissiveIntensity={hovered ? 0.9 : 0.35}
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
          ))}
          {/* Puente */}
          <mesh position={[0.06, 0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.024, 0.024, 0.5, 8]} />
            <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Patillas hacia atrás */}
          {[-1, 1].map((s) => (
            <mesh key={`temple-${s}`} position={[-0.18, 0.05, s * 0.5]} rotation={[0, s * 0.5, 0]}>
              <boxGeometry args={[0.5, 0.03, 0.03]} />
              <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.3} />
            </mesh>
          ))}
        </group>

        {/* ---------- Mandíbula inferior (ruge al clic) ---------- */}
        <group ref={jaw} position={[0.1, -0.3, 0]}>
          <mesh position={[0.6, -0.06, 0]} scale={[1.7, 0.4, 0.66]}>
            <sphereGeometry args={[0.4, 20, 20]} />
            <meshStandardMaterial color={SKIN_DARK} roughness={0.95} />
          </mesh>
          {/* Boca interior */}
          <mesh position={[0.55, 0.06, 0]} scale={[1.4, 0.18, 0.5]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial color="#7A3B3B" roughness={1} />
          </mesh>
          {/* Dientes inferiores */}
          {teeth.slice(0, 6).map((tn, i) => (
            <mesh key={`lt-${i}`} position={[tn.x, 0.1, 0.16]} scale={tn.s * 0.85}>
              <coneGeometry args={[0.05, 0.2, 8]} />
              <meshStandardMaterial color="#F2EFE4" roughness={0.45} />
            </mesh>
          ))}
        </group>

        {/* Dientes superiores (colgando del hocico) */}
        {teeth.map((tn, i) => (
          <mesh
            key={`ut-${i}`}
            position={[0.34 + i * 0.16, -0.4, 0.18]}
            rotation={[Math.PI, 0, 0]}
            scale={tn.s}
          >
            <coneGeometry args={[0.055, 0.24, 8]} />
            <meshStandardMaterial color="#F2EFE4" roughness={0.45} />
          </mesh>
        ))}
        {teeth.map((tn, i) => (
          <mesh
            key={`utb-${i}`}
            position={[0.34 + i * 0.16, -0.4, -0.18]}
            rotation={[Math.PI, 0, 0]}
            scale={tn.s}
          >
            <coneGeometry args={[0.055, 0.24, 8]} />
            <meshStandardMaterial color="#F2EFE4" roughness={0.45} />
          </mesh>
        ))}

        {/* Penacho / cresta */}
        {[-0.1, -0.3, -0.5].map((x, i) => (
          <mesh key={`crest-${i}`} position={[x, 0.55 + i * 0.04, 0]} rotation={[0, 0, -0.4 - i * 0.2]}>
            <coneGeometry args={[0.07, 0.26, 6]} />
            <meshStandardMaterial color={SKIN_DARK} roughness={0.95} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Escena del hero                                                     */
/* ------------------------------------------------------------------ */

function Exhibit() {
  return (
    <>
      {/* Luz de vitrina de museo */}
      <ambientLight intensity={0.5} color="#FFFFFF" />
      <directionalLight position={[3.5, 5, 2.5]} intensity={1.45} color="#FFFDF8" />
      {/* Rim morado trasero */}
      <pointLight position={[-2.8, 1.6, -2.4]} intensity={30} color="#A98FD6" distance={14} />
      {/* Relleno dorado */}
      <pointLight position={[2.4, -0.4, 2.6]} intensity={10} color="#C4A35A" distance={12} />

      <group position={[0, -0.4, 0]}>
        <TRexBust />

        {/* Pedestal de museo */}
        <mesh position={[-0.5, -1.5, 0]}>
          <cylinderGeometry args={[1.1, 1.35, 0.4, 6]} />
          <meshStandardMaterial color="#1F1433" roughness={1} />
        </mesh>
        <mesh position={[-0.5, -1.72, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 0.08, 48]} />
          <meshStandardMaterial color="#120D1D" roughness={1} />
        </mesh>

        {/* Anillo escáner */}
        <mesh position={[-0.5, -1.26, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.18, 0.018, 10, 90]} />
          <meshStandardMaterial
            color="#C4A35A"
            emissive="#C4A35A"
            emissiveIntensity={1.6}
            toneMapped={false}
          />
        </mesh>
      </group>

      <ContactShadows
        position={[0, -2.2, 0]}
        opacity={0.35}
        scale={9}
        blur={2.8}
        far={3.5}
        color="#000000"
      />

      {/* Polvo de la excavación */}
      <Sparkles
        count={45}
        scale={[7, 5, 5]}
        position={[0, 0.4, 0]}
        size={2.6}
        speed={0.3}
        opacity={0.45}
        color="#A98FD6"
      />
    </>
  );
}

/**
 * Vitrina 3D del hero: bust de T-Rex con gafas de desarrollador,
 * mirada que sigue el cursor, rugido al clic y rotación 360°.
 */
export default function HeroTRex3D() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0.4, 6.4], fov: 40 }}
    >
      <Exhibit />
    </Canvas>
  );
}
