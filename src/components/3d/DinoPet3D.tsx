'use client';

import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface DinoPet3DProps {
  /** Cuando la sección entra en pantalla, el dino empieza a correr. */
  active?: boolean;
}

/* Colores de piel realista (oliva) */
const SKIN = '#66744F';
const SKIN_DARK = '#46523A';
const BELLY = '#C9C2A8';
const CLAW = '#2E2E2A';
const EYE = '#14150F';

/**
 * Terópodo realista que corre de un lado a otro del vivarium
 * (ciclo de patas, cola de contrapeso, cabeceo) mientras su sección
 * está visible; al hacer clic da un salto con giro.
 */
function Dino({ active = false }: DinoPet3DProps) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const shinL = useRef<THREE.Group>(null);
  const shinR = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);

  const [hovered, setHovered] = useState(false);

  // Estado del salto
  const jump = useRef<{ start: number } | null>(null);
  const welcomed = useRef(false);

  // Fase del ciclo de carrera y factor de mezcla (0 = parado, 1 = corriendo)
  const stride = useRef(0);
  const runMix = useRef(0);
  const facing = useRef(0);

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  const triggerJump = () => {
    if (reducedMotion) return;
    jump.current = { start: performance.now() / 1000 };
  };

  // Saludo al entrar en pantalla
  if (active && !welcomed.current) {
    welcomed.current = true;
    triggerJump();
  }

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const now = performance.now() / 1000;

    // ---------- Mezcla corriendo / parado ----------
    const targetRun = active && !reducedMotion ? 1 : 0;
    runMix.current = THREE.MathUtils.lerp(runMix.current, targetRun, 0.06);
    const run = runMix.current;

    // Fase de zancada (acelera al correr)
    stride.current += delta * (1.5 + run * 8.5);
    const p = stride.current;

    // ---------- Recorrido de ida y vuelta ----------
    const rootGroup = root.current;
    if (rootGroup) {
      const omega = 0.42;
      const travelX = Math.sin(t * omega) * 1.85 * run;
      rootGroup.position.x = THREE.MathUtils.lerp(rootGroup.position.x, travelX, 0.2);

      // Dirección de la marcha (0 = derecha, PI = izquierda)
      const travelDir = Math.cos(t * omega) >= 0 ? 0 : Math.PI;
      const look = state.pointer.x * 0.3;
      const targetFacing = run > 0.4 ? travelDir : look;
      facing.current = THREE.MathUtils.lerp(facing.current, targetFacing, 0.1);
      rootGroup.rotation.y = facing.current;

      // Salto con giro
      if (jump.current) {
        const jp = (now - jump.current.start) / 0.9;
        if (jp >= 1) {
          jump.current = null;
          rootGroup.position.y = 0;
          rootGroup.rotation.z = 0;
          rootGroup.rotation.y = facing.current;
        } else {
          const arc = Math.sin(jp * Math.PI);
          rootGroup.position.y = arc * 0.7;
          rootGroup.rotation.z = arc * 0.12;
          rootGroup.rotation.y = facing.current + jp * Math.PI * 2;
        }
      } else {
        rootGroup.position.y = THREE.MathUtils.lerp(rootGroup.position.y, 0, 0.12);
        rootGroup.rotation.z = THREE.MathUtils.lerp(rootGroup.rotation.z, 0, 0.12);
      }
    }

    // ---------- Cuerpo: respiración + cabeceo al correr ----------
    if (body.current) {
      const breathe = 1 + Math.sin(t * 2.4) * 0.018;
      const gallop = Math.abs(Math.sin(p)) * 0.07 * run;
      body.current.scale.set(1, breathe, breathe);
      body.current.position.y = gallop;
      body.current.rotation.z = -0.06 * run;
    }

    // ---------- Patas: ciclo de zancada ----------
    const swingL = Math.sin(p) * 0.85 * run + 0.14 * (1 - run);
    const swingR = Math.sin(p + Math.PI) * 0.85 * run + 0.14 * (1 - run);
    if (legL.current) legL.current.rotation.z = swingL;
    if (legR.current) legR.current.rotation.z = swingR;
    // Rodilla: flexión en la fase de recuperación
    if (shinL.current)
      shinL.current.rotation.z = Math.max(0, Math.sin(p + Math.PI * 0.6)) * 1.05 * run + 0.25 * (1 - run);
    if (shinR.current)
      shinR.current.rotation.z =
        Math.max(0, Math.sin(p + Math.PI * 1.6)) * 1.05 * run + 0.25 * (1 - run);

    // ---------- Cola: contrapeso ----------
    if (tail.current) {
      tail.current.rotation.y = Math.sin(p) * 0.3 * run + Math.sin(t * 1.6) * 0.1;
      tail.current.rotation.z = Math.sin(p * 0.5) * 0.08 * run;
    }

    // ---------- Cabeza: mirada + cabeceo ----------
    if (head.current) {
      head.current.rotation.z = -0.08 * run + Math.sin(t * 1.9) * 0.04;
      head.current.position.y = 1.58 + Math.sin(p) * 0.04 * run;
    }

    // ---------- Brazos: balanceo mínimo ----------
    const armSwing = Math.sin(p + Math.PI) * 0.25 * run;
    if (armL.current) armL.current.rotation.z = 0.9 + armSwing;
    if (armR.current) armR.current.rotation.z = 0.9 - armSwing;
  });

  /* ---------- Geometría ---------- */
  return (
    <>
      {/* Luces de vivarium */}
      <ambientLight intensity={0.55} color="#FFFFFF" />
      <directionalLight position={[3, 4, 3]} intensity={1.4} color="#FFFDF8" />
      <pointLight position={[-2.5, 1.5, -2]} intensity={14} color="#8577F0" distance={10} />
      <pointLight position={[2.5, 1, 2]} intensity={7} color="#2E8B62" distance={10} />

      <group
        ref={root}
        onPointerDown={(e) => {
          e.stopPropagation();
          triggerJump();
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
        <group ref={body} position={[0, 0, 0]}>
          {/* ---------- Torso ---------- */}
          <mesh position={[0, 0.95, 0]} scale={[1.25, 0.78, 0.72]}>
            <sphereGeometry args={[0.62, 24, 24]} />
            <meshStandardMaterial color={SKIN} roughness={0.9} />
          </mesh>
          {/* Cadera */}
          <mesh position={[-0.5, 0.9, 0]} scale={[1, 1.05, 0.9]}>
            <sphereGeometry args={[0.5, 20, 20]} />
            <meshStandardMaterial color={SKIN_DARK} roughness={0.9} />
          </mesh>
          {/* Pecho */}
          <mesh position={[0.5, 1.0, 0]} scale={[1, 0.9, 0.85]}>
            <sphereGeometry args={[0.45, 20, 20]} />
            <meshStandardMaterial color={SKIN} roughness={0.9} />
          </mesh>
          {/* Vientre */}
          <mesh position={[0.1, 0.68, 0]} scale={[1.4, 0.5, 0.7]}>
            <sphereGeometry args={[0.5, 18, 18]} />
            <meshStandardMaterial color={BELLY} roughness={0.95} />
          </mesh>
          {/* Franjas dorsales */}
          {[-0.35, 0.0, 0.35].map((x, i) => (
            <mesh key={`stripe-${i}`} position={[x, 1.42 - i * 0.03, 0]} scale={[1, 0.35, 1.1]}>
              <sphereGeometry args={[0.22 - i * 0.02, 12, 12]} />
              <meshStandardMaterial color={SKIN_DARK} roughness={0.95} />
            </mesh>
          ))}
          {/* Púas dorsales */}
          {[0.4, 0.05, -0.3, -0.65].map((x, i) => (
            <mesh key={`spine-${i}`} position={[x, 1.5 - i * 0.05, 0]} rotation={[0, 0, -0.2]}>
              <coneGeometry args={[0.05, 0.16, 4]} />
              <meshStandardMaterial color={CLAW} roughness={0.8} />
            </mesh>
          ))}

          {/* ---------- Cuello ---------- */}
          <mesh position={[0.88, 1.32, 0]} rotation={[0, 0, -0.5]}>
            <cylinderGeometry args={[0.2, 0.32, 0.75, 8]} />
            <meshStandardMaterial color={SKIN} roughness={0.9} />
          </mesh>

          {/* ---------- Cabeza ---------- */}
          <group ref={head} position={[1.16, 1.58, 0]}>
            {/* Cráneo */}
            <mesh scale={[1.05, 0.75, 0.7]}>
              <sphereGeometry args={[0.32, 24, 24]} />
              <meshStandardMaterial color={SKIN} roughness={0.9} />
            </mesh>
            {/* Hocico */}
            <mesh position={[0.36, -0.06, 0]} scale={[1.35, 0.5, 0.55]}>
              <sphereGeometry args={[0.24, 20, 20]} />
              <meshStandardMaterial color={SKIN_DARK} roughness={0.9} />
            </mesh>
            {/* Mandíbula inferior (boca entreabierta) */}
            <group position={[0.08, -0.2, 0]} rotation={[0, 0, -0.16]}>
              <mesh position={[0.3, 0, 0]} scale={[1.5, 0.4, 0.55]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial color={BELLY} roughness={0.92} />
              </mesh>
              {/* Dientes */}
              {[0.18, 0.3, 0.42].map((x, i) => (
                <mesh key={`tooth-${i}`} position={[x, 0.09, 0.08]} rotation={[Math.PI, 0, 0]}>
                  <coneGeometry args={[0.022, 0.09, 6]} />
                  <meshStandardMaterial color="#F5F1E8" roughness={0.5} />
                </mesh>
              ))}
            </group>
            {/* Ceja feroz */}
            <mesh position={[0.16, 0.16, 0]} rotation={[0, 0, -0.12]}>
              <boxGeometry args={[0.3, 0.07, 0.5]} />
              <meshStandardMaterial color={SKIN_DARK} roughness={0.9} />
            </mesh>
            {/* Ojos */}
            {[-1, 1].map((s) => (
              <group key={`eye-${s}`} position={[0.2, 0.06, s * 0.2]}>
                <mesh>
                  <sphereGeometry args={[0.055, 14, 14]} />
                  <meshStandardMaterial
                    color={hovered ? '#6657E2' : EYE}
                    emissive={hovered ? '#8577F0' : '#000000'}
                    emissiveIntensity={hovered ? 0.8 : 0}
                    roughness={0.3}
                  />
                </mesh>
                <mesh position={[0.03, 0.02, s * 0.02]}>
                  <sphereGeometry args={[0.016, 10, 10]} />
                  <meshBasicMaterial color="#FFFFFF" toneMapped={false} />
                </mesh>
              </group>
            ))}
            {/* Penacho */}
            <mesh position={[-0.06, 0.3, 0]} rotation={[0, 0, -0.35]} scale={[1, 1, 0.3]}>
              <coneGeometry args={[0.09, 0.26, 6]} />
              <meshStandardMaterial color={SKIN_DARK} roughness={0.9} />
            </mesh>
          </group>

          {/* ---------- Brazos cortos ---------- */}
          {[
            { s: 1, ref: armL },
            { s: -1, ref: armR },
          ].map(({ s, ref }) => (
            <group key={`arm-${s}`} ref={ref} position={[0.62, 1.02, s * 0.22]}>
              <mesh position={[0.1, -0.12, 0]} rotation={[0, 0, -0.5]}>
                <cylinderGeometry args={[0.045, 0.055, 0.3, 6]} />
                <meshStandardMaterial color={SKIN_DARK} roughness={0.9} />
              </mesh>
              <mesh position={[0.2, -0.24, 0]} rotation={[0, 0, -1.1]}>
                <coneGeometry args={[0.03, 0.12, 6]} />
                <meshStandardMaterial color={CLAW} roughness={0.7} />
              </mesh>
            </group>
          ))}

          {/* ---------- Patas potentes ---------- */}
          {[
            { s: 1, leg: legL, shin: shinL },
            { s: -1, leg: legR, shin: shinR },
          ].map(({ s, leg, shin }) => (
            <group key={`leg-${s}`} ref={leg} position={[-0.42, 0.78, s * 0.3]}>
              {/* Muslo */}
              <mesh position={[0.05, -0.12, 0]} scale={[1, 1.2, 0.75]}>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial color={SKIN_DARK} roughness={0.9} />
              </mesh>
              {/* Pantorrilla (se flexiona) */}
              <group ref={shin} position={[0.05, -0.42, 0]}>
                <mesh position={[0, -0.26, 0]}>
                  <cylinderGeometry args={[0.09, 0.13, 0.55, 7]} />
                  <meshStandardMaterial color={SKIN} roughness={0.9} />
                </mesh>
                {/* Pie + garras */}
                <mesh position={[0.1, -0.56, 0]}>
                  <boxGeometry args={[0.36, 0.1, 0.18]} />
                  <meshStandardMaterial color={SKIN_DARK} roughness={0.9} />
                </mesh>
                {[-0.06, 0.06].map((z) => (
                  <mesh key={`claw-${z}`} position={[0.3, -0.56, z]} rotation={[0, 0, -Math.PI / 2]}>
                    <coneGeometry args={[0.03, 0.12, 6]} />
                    <meshStandardMaterial color={CLAW} roughness={0.7} />
                  </mesh>
                ))}
              </group>
            </group>
          ))}

          {/* ---------- Cola larga de contrapeso ---------- */}
          <group ref={tail} position={[-0.78, 0.92, 0]}>
            <mesh position={[-0.95, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <coneGeometry args={[0.3, 1.9, 8]} />
              <meshStandardMaterial color={SKIN} roughness={0.9} />
            </mesh>
            {/* Punta más oscura */}
            <mesh position={[-1.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <coneGeometry args={[0.1, 0.5, 8]} />
              <meshStandardMaterial color={SKIN_DARK} roughness={0.9} />
            </mesh>
          </group>
        </group>
      </group>

      {/* Suelo del vivarium (piedra clara) */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3, 48]} />
        <meshStandardMaterial color="#EDEBE5" roughness={1} />
      </mesh>
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.3, 2.36, 64]} />
        <meshBasicMaterial color="#6657E2" transparent opacity={0.5} toneMapped={false} />
      </mesh>

      {/* Polvo levantado al correr */}
      {active && (
        <Sparkles
          count={24}
          scale={[5, 0.7, 2]}
          position={[0, 0.15, 0]}
          size={2.4}
          speed={1.4}
          opacity={0.55}
          color="#B7AE9B"
        />
      )}

      <ContactShadows
        position={[0, 0.0, 0]}
        opacity={0.3}
        scale={7}
        blur={2.6}
        far={2}
        color="#3A3F38"
      />
    </>
  );
}

/** Vivarium 3D del terópodo: Canvas con la escena interactiva. */
export default function DinoPet3D(props: DinoPet3DProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 1.4, 6.2], fov: 42 }}
    >
      <Dino {...props} />
    </Canvas>
  );
}
