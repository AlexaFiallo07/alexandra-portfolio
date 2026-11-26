'use client';

import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';
import AutoFrameRig from '@/components/3d/AutoFrameRig';
import ZoomControls from '@/components/3d/ZoomControls';
import { useCameraZoom } from '@/lib/cameraZoom';
import HeroTRexFallback from '@/components/dino/HeroTRexFallback';

/* ─── Paleta Studio Light ─── */
const GREEN = '#3E9D7B';
const GREEN_DEEP = '#2B775D';
const GREEN_LIGHT = '#5FB794';
const MINT_BELLY = '#C9E7D9';
const PURPLE = '#6A4DAB';
const PURPLE_DEEP = '#3A2370';
const PURPLE_GLOW = '#A98FD6';
const INK = '#1F1433';

/* ─── WebGL check ─── */
function hasWebGL(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl')),
    );
  } catch {
    return false;
  }
}

/* ─── Error Boundary ─── */
class ThreeErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

/* ─── Types ─── */
interface TRexProps {
  selected: boolean;
  dragging: boolean;
  dragDelta: React.MutableRefObject<{ x: number; y: number }>;
  pointerNorm: React.MutableRefObject<{ x: number; y: number }>;
  roarSignal: number;
}

/* ══════════════════════════════════════════════════════════════
   Partículas de código flotantes que salen cuando ruge
   ══════════════════════════════════════════════════════════════ */
function CodeParticles({ count }: { count: number }) {
  const ref = useRef<THREE.Group>(null);
  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      pos: [
        (Math.random() - 0.5) * 2.5,
        Math.random() * 1.8 + 0.2,
        (Math.random() - 0.5) * 2,
      ] as [number, number, number],
      speed: 0.3 + Math.random() * 0.6,
      size: 0.04 + Math.random() * 0.06,
      color: i % 3 === 0 ? PURPLE : i % 3 === 1 ? GREEN : PURPLE_GLOW,
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.children.forEach((child, i) => {
      const p = particles[i];
      if (!p) return;
      const mesh = child as THREE.Mesh;
      mesh.position.y = p.pos[1] + Math.sin(t * p.speed + p.offset) * 0.3;
      mesh.position.x = p.pos[0] + Math.sin(t * 0.4 + p.offset) * 0.15;
      mesh.rotation.x = t * p.speed;
      mesh.rotation.z = t * p.speed * 0.7;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.35 + Math.sin(t * 2 + p.offset) * 0.25;
    });
  });

  return (
    <group ref={ref}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.pos}>
          {i % 4 === 0 ? (
            <octahedronGeometry args={[p.size]} />
          ) : i % 4 === 1 ? (
            <boxGeometry args={[p.size, p.size, p.size]} />
          ) : i % 4 === 2 ? (
            <tetrahedronGeometry args={[p.size]} />
          ) : (
            <dodecahedronGeometry args={[p.size]} />
          )}
          <meshStandardMaterial
            color={p.color}
            transparent
            opacity={0.5}
            roughness={0.3}
            emissive={p.color}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   Portátil flotante con stickers
   ══════════════════════════════════════════════════════════════ */
function FloatingLaptop() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = -0.65 + Math.sin(t * 1.2) * 0.02;
    ref.current.rotation.y = Math.sin(t * 0.3) * 0.05;
  });

  return (
    <group ref={ref} position={[0.9, -0.65, 0.6]} rotation={[0, -0.6, 0]}>
      {/* Base del laptop */}
      <mesh rotation={[-Math.PI / 2 + 0.05, 0, 0]}>
        <boxGeometry args={[0.65, 0.42, 0.025]} />
        <meshStandardMaterial color="#EFEAF7" roughness={0.4} />
      </mesh>
      {/* Teclado */}
      <mesh position={[0, 0.016, 0]} rotation={[-Math.PI / 2 + 0.05, 0, 0]}>
        <boxGeometry args={[0.55, 0.32, 0.005]} />
        <meshStandardMaterial color="#E4DCF1" roughness={0.5} />
      </mesh>
      {/* Pantalla */}
      <mesh position={[0, 0.22, -0.2]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[0.63, 0.4, 0.015]} />
        <meshStandardMaterial color="#F6F3FB" roughness={0.3} />
      </mesh>
      {/* Pantalla interior - contenido */}
      <mesh position={[0, 0.22, -0.19]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[0.56, 0.33, 0.005]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} emissive="#EFEAF7" emissiveIntensity={0.3} />
      </mesh>
      {/* Sticker morado */}
      <mesh position={[-0.15, 0.25, -0.215]} rotation={[0.35, 0, 0.1]}>
        <boxGeometry args={[0.08, 0.06, 0.005]} />
        <meshStandardMaterial color={PURPLE} roughness={0.3} />
      </mesh>
      {/* Sticker verde */}
      <mesh position={[0.12, 0.3, -0.215]} rotation={[0.35, 0, -0.15]}>
        <boxGeometry args={[0.07, 0.07, 0.005]} />
        <meshStandardMaterial color={GREEN} roughness={0.3} />
      </mesh>
      {/* Líneas de código en pantalla */}
      {[-0.06, 0, 0.06].map((y, i) => (
        <mesh key={i} position={[-0.1 + i * 0.03, 0.22 + y, -0.183]} rotation={[0.35, 0, 0]}>
          <boxGeometry args={[0.2 - i * 0.04, 0.015, 0.002]} />
          <meshStandardMaterial
            color={i === 0 ? PURPLE : i === 1 ? GREEN : PURPLE_GLOW}
            roughness={0.3}
            emissive={i === 0 ? PURPLE : i === 1 ? GREEN : PURPLE_GLOW}
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   T-Rex 3D — procedural, estilo estudio luminoso
   • Auto-rota 360° continuamente
   • Click-and-drag para girar manualmente
   • Modo "seleccionado" sigue el mouse
   • Pupilas reactivas, respiración, cola, mandíbula
   • Reacción al "rugir" (roarSignal)
   ══════════════════════════════════════════════════════════════ */
function StudioTRex3D({ selected, dragging, dragDelta, pointerNorm, roarSignal }: TRexProps) {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const jaw = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const pupilL = useRef<THREE.Mesh>(null);
  const pupilR = useRef<THREE.Mesh>(null);
  const selRing = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Mesh>(null);

  const [hovered, setHovered] = useState(false);
  const roarTime = useRef(0);
  const prevRoar = useRef(roarSignal);

  /* Ángulos y posición objetivo para suavizado (lerp) */
  const targetRot = useRef({ x: 0.08, y: -0.45 });
  const targetPos = useRef({ x: 0, y: 0 });

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const rootGroup = root.current;
    if (!rootGroup) return;

    /* Detectar rugido nuevo */
    if (roarSignal !== prevRoar.current) {
      roarTime.current = t;
      prevRoar.current = roarSignal;
    }
    const timeSinceRoar = t - roarTime.current;
    const isRoaring = timeSinceRoar < 0.8;

    const px = THREE.MathUtils.clamp(pointerNorm.current.x, -1, 1);
    const py = THREE.MathUtils.clamp(pointerNorm.current.y, -1, 1);

    /* ─── Rotación según estado ─── */
    if (dragging) {
      targetRot.current.y += dragDelta.current.x * 0.012;
      targetRot.current.x = THREE.MathUtils.clamp(
        targetRot.current.x + dragDelta.current.y * 0.009,
        -0.55,
        0.55,
      );
      targetPos.current.x = THREE.MathUtils.clamp(px * 0.55, -0.65, 0.65);
      targetPos.current.y = THREE.MathUtils.clamp(py * 0.35, -0.35, 0.4);
      dragDelta.current.x = 0;
      dragDelta.current.y = 0;
    } else if (selected) {
      targetRot.current.y = -0.35 + px * 1.45;
      targetRot.current.x = THREE.MathUtils.clamp(-py * 0.45, -0.45, 0.45);
      targetPos.current.x = px * 0.48;
      targetPos.current.y = py * 0.28;
    } else {
      /* Auto-rotación fluida 360° */
      if (!reducedMotion) {
        targetRot.current.y += delta * 0.55;
      }
      targetRot.current.x = THREE.MathUtils.lerp(targetRot.current.x, 0.08 - py * 0.1, 0.05);
      targetPos.current.x = THREE.MathUtils.lerp(targetPos.current.x, 0, 0.06);
      targetPos.current.y = THREE.MathUtils.lerp(targetPos.current.y, 0, 0.06);
    }

    /* Aplicar con suavizado */
    rootGroup.rotation.y = THREE.MathUtils.lerp(rootGroup.rotation.y, targetRot.current.y, 0.12);
    rootGroup.rotation.x = THREE.MathUtils.lerp(rootGroup.rotation.x, targetRot.current.x, 0.12);
    rootGroup.position.x = THREE.MathUtils.lerp(rootGroup.position.x, targetPos.current.x, 0.1);

    /* Respiración suave */
    const breathe = Math.sin(t * 2.2) * 0.04;
    rootGroup.position.y = THREE.MathUtils.lerp(
      rootGroup.position.y,
      targetPos.current.y + breathe,
      0.1,
    );

    /* Escala del cuerpo para simular respiración */
    if (bodyRef.current) {
      const breathScale = 1 + Math.sin(t * 2.2) * 0.012;
      bodyRef.current.scale.set(1.15 * breathScale, 0.95 * breathScale, 0.85 * breathScale);
    }

    /* ─── Pupilas siguiendo el cursor ─── */
    const eyeX = px * 0.045;
    const eyeY = py * 0.035;
    for (const p of [pupilL.current, pupilR.current]) {
      if (!p) continue;
      p.position.x = THREE.MathUtils.lerp(p.position.x, 0.055 + eyeX, 0.16);
      p.position.y = THREE.MathUtils.lerp(p.position.y, eyeY, 0.16);
    }

    /* ─── Mandíbula: rugido abre grande, hover abre un poco, idle respira ─── */
    if (jaw.current) {
      let targetJaw: number;
      if (isRoaring) {
        targetJaw = -0.35 + Math.sin(timeSinceRoar * 12) * 0.1;
      } else if (selected || hovered) {
        targetJaw = -0.14 + Math.sin(t * 4) * 0.05;
      } else {
        targetJaw = Math.sin(t * 2) * 0.03;
      }
      jaw.current.rotation.z = THREE.MathUtils.lerp(jaw.current.rotation.z, targetJaw, 0.14);
    }

    /* ─── Cabeza: inclina con el mouse o idle bobbing ─── */
    if (head.current) {
      let headTarget: number;
      if (isRoaring) {
        headTarget = -0.15 + Math.sin(timeSinceRoar * 15) * 0.08;
      } else if (selected) {
        headTarget = py * 0.14;
      } else {
        headTarget = Math.sin(t * 1.5) * 0.03;
      }
      head.current.rotation.z = THREE.MathUtils.lerp(head.current.rotation.z, headTarget, 0.1);
      head.current.rotation.y = THREE.MathUtils.lerp(
        head.current.rotation.y,
        selected ? px * 0.1 : Math.sin(t * 1.1) * 0.02,
        0.08,
      );
    }

    /* ─── Cola: movimiento sinusoidal ─── */
    if (tail.current) {
      const tailIntensity = isRoaring ? 0.45 : selected ? 0.28 : 0.14;
      const tailSpeed = isRoaring ? 6 : 2.8;
      tail.current.rotation.y = Math.sin(t * tailSpeed) * tailIntensity;
      tail.current.rotation.z = Math.sin(t * 1.5) * 0.03;
    }

    /* ─── Bracitos: tecleando / agitándose ─── */
    if (armL.current) {
      const armAngle = isRoaring
        ? -0.5 + Math.sin(t * 14) * 0.3
        : -0.5 + Math.sin(t * 3.5) * 0.08;
      armL.current.rotation.z = THREE.MathUtils.lerp(armL.current.rotation.z, armAngle, 0.12);
    }
    if (armR.current) {
      const armAngle = isRoaring
        ? -0.5 + Math.sin(t * 14 + 1) * 0.3
        : -0.5 + Math.sin(t * 3.5 + 1.5) * 0.08;
      armR.current.rotation.z = THREE.MathUtils.lerp(armR.current.rotation.z, armAngle, 0.12);
    }

    /* ─── Anillo de selección ─── */
    if (selRing.current) {
      const mat = selRing.current.material as THREE.MeshStandardMaterial;
      const targetOpacity = selected || dragging ? 0.9 : 0.25;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.12);
      selRing.current.rotation.z = t * 0.4;
      const ringScale = selected || dragging ? 1.05 + Math.sin(t * 3) * 0.03 : 1;
      selRing.current.scale.setScalar(ringScale);
    }
  });

  const teeth = useMemo(
    () => Array.from({ length: 5 }, (_, i) => ({ x: 0.24 + i * 0.15, s: 1 - i * 0.08 })),
    [],
  );

  return (
    <group position={[0, -0.35, 0]}>
      <group
        ref={root}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        {/* ─── Cuerpo principal ─── */}
        <mesh ref={bodyRef} position={[-0.25, 0.08, 0]} rotation={[0, 0, 0.28]} scale={[1.15, 0.95, 0.85]}>
          <sphereGeometry args={[0.72, 32, 32]} />
          <meshStandardMaterial color={GREEN} roughness={0.42} metalness={0.08} />
        </mesh>

        {/* Vientre menta claro */}
        <mesh position={[-0.08, -0.02, 0]} rotation={[0, 0, 0.25]} scale={[1.0, 0.88, 0.72]}>
          <sphereGeometry args={[0.58, 24, 24]} />
          <meshStandardMaterial color={MINT_BELLY} roughness={0.5} />
        </mesh>

        {/* Escamas / textura en el cuerpo */}
        {[
          [-0.4, 0.3, 0.3],
          [-0.5, 0.1, 0.35],
          [-0.35, -0.1, 0.32],
          [-0.4, 0.3, -0.3],
          [-0.5, 0.1, -0.35],
        ].map(([x, y, z], i) => (
          <mesh key={`scale-${i}`} position={[x, y, z]} rotation={[0, 0, 0.3 + i * 0.1]}>
            <circleGeometry args={[0.06, 6]} />
            <meshStandardMaterial
              color={GREEN_DEEP}
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
              roughness={0.6}
            />
          </mesh>
        ))}

        {/* Cuello */}
        <mesh position={[0.1, 0.78, 0]} rotation={[0, 0, -0.25]}>
          <cylinderGeometry args={[0.36, 0.5, 0.85, 20]} />
          <meshStandardMaterial color={GREEN} roughness={0.45} />
        </mesh>

        {/* ─── Patas traseras ─── */}
        {[-1, 1].map((s) => (
          <group key={`leg-${s}`} position={[-0.22, -0.58, s * 0.42]}>
            {/* Muslo */}
            <mesh position={[0, 0.15, 0]} scale={[0.9, 1.15, 0.75]}>
              <sphereGeometry args={[0.28, 18, 18]} />
              <meshStandardMaterial color={GREEN_DEEP} roughness={0.5} />
            </mesh>
            {/* Canilla */}
            <mesh position={[0.04, -0.18, 0]}>
              <cylinderGeometry args={[0.12, 0.15, 0.42, 14]} />
              <meshStandardMaterial color={GREEN} roughness={0.45} />
            </mesh>
            {/* Pie con garras */}
            <mesh position={[0.14, -0.38, 0]}>
              <boxGeometry args={[0.38, 0.12, 0.24]} />
              <meshStandardMaterial color={GREEN_DEEP} roughness={0.45} />
            </mesh>
            {/* Garras */}
            {[-0.08, 0, 0.08].map((gz, gi) => (
              <mesh key={`claw-${s}-${gi}`} position={[0.34, -0.4, gz]} rotation={[0, 0, -0.3]}>
                <coneGeometry args={[0.025, 0.08, 6]} />
                <meshStandardMaterial color="#F6F3FB" roughness={0.3} />
              </mesh>
            ))}
          </group>
        ))}

        {/* ─── Bracitos cortos animados ─── */}
        <group ref={armL} position={[0.34, 0.28, 0.45]} rotation={[0, 0, -0.5]}>
          <mesh>
            <capsuleGeometry args={[0.08, 0.28, 8, 12]} />
            <meshStandardMaterial color={GREEN_DEEP} roughness={0.45} />
          </mesh>
          {/* Mano con deditos */}
          <mesh position={[0, -0.2, 0]}>
            <sphereGeometry args={[0.06, 10, 10]} />
            <meshStandardMaterial color={GREEN_LIGHT} roughness={0.45} />
          </mesh>
        </group>
        <group ref={armR} position={[0.34, 0.28, -0.45]} rotation={[0, 0, -0.5]}>
          <mesh>
            <capsuleGeometry args={[0.08, 0.28, 8, 12]} />
            <meshStandardMaterial color={GREEN_DEEP} roughness={0.45} />
          </mesh>
          <mesh position={[0, -0.2, 0]}>
            <sphereGeometry args={[0.06, 10, 10]} />
            <meshStandardMaterial color={GREEN_LIGHT} roughness={0.45} />
          </mesh>
        </group>

        {/* ─── Cola articulada ─── */}
        <group ref={tail} position={[-0.78, -0.1, 0]}>
          <mesh position={[-0.35, 0.04, 0]} rotation={[0, 0, Math.PI / 2 - 0.15]}>
            <coneGeometry args={[0.32, 0.9, 18]} />
            <meshStandardMaterial color={GREEN} roughness={0.45} />
          </mesh>
          {/* Punta de la cola */}
          <mesh position={[-0.95, 0.06, 0]} rotation={[0, 0, Math.PI / 2 - 0.1]}>
            <coneGeometry args={[0.18, 0.65, 14]} />
            <meshStandardMaterial color={GREEN_DEEP} roughness={0.45} />
          </mesh>
          {/* Escamas en la cola */}
          {[-0.3, -0.55, -0.8].map((cx, ci) => (
            <mesh key={`tail-scale-${ci}`} position={[cx, 0.22, 0]} rotation={[0, 0, 0.5]}>
              <coneGeometry args={[0.05, 0.1, 5]} />
              <meshStandardMaterial color={PURPLE} roughness={0.35} metalness={0.1} />
            </mesh>
          ))}
        </group>

        {/* ─── Placas dorsales moradas ─── */}
        {[
          { pos: [-0.55, 0.56, 0] as [number, number, number], sz: 0.14 },
          { pos: [-0.3, 0.76, 0] as [number, number, number], sz: 0.17 },
          { pos: [-0.08, 0.96, 0] as [number, number, number], sz: 0.15 },
          { pos: [0.08, 1.08, 0] as [number, number, number], sz: 0.12 },
        ].map(({ pos, sz }, i) => (
          <mesh key={`spike-${i}`} position={pos} rotation={[0, 0, 0.5]}>
            <coneGeometry args={[sz * 0.75, sz * 2.2, 6]} />
            <meshStandardMaterial
              color={PURPLE}
              roughness={0.3}
              metalness={0.15}
              emissive={PURPLE_GLOW}
              emissiveIntensity={0.08}
            />
          </mesh>
        ))}

        {/* ─── Cabeza + Gafas de pasta moradas ─── */}
        <group ref={head} position={[0.25, 1.24, 0]}>
          {/* Cráneo */}
          <mesh scale={[1.18, 0.92, 0.9]}>
            <sphereGeometry args={[0.52, 32, 32]} />
            <meshStandardMaterial color={GREEN} roughness={0.4} />
          </mesh>

          {/* Hocico superior */}
          <mesh position={[0.62, -0.06, 0]} scale={[1.22, 0.62, 0.72]}>
            <sphereGeometry args={[0.42, 24, 24]} />
            <meshStandardMaterial color={GREEN} roughness={0.4} />
          </mesh>

          {/* Narinas */}
          {[-1, 1].map((s) => (
            <mesh key={`nostril-${s}`} position={[1.02, 0.04, s * 0.12]}>
              <sphereGeometry args={[0.045, 10, 10]} />
              <meshStandardMaterial color={INK} roughness={0.7} />
            </mesh>
          ))}

          {/* ─── Ojos + pupilas reactivas al mouse ─── */}
          {[
            { s: 1, ref: pupilL },
            { s: -1, ref: pupilR },
          ].map(({ s, ref }) => (
            <group key={`eye-${s}`} position={[0.26, 0.12, s * 0.36]}>
              {/* Esclerótica */}
              <mesh>
                <sphereGeometry args={[0.14, 20, 20]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
              </mesh>
              {/* Iris verde brillante */}
              <mesh position={[0.045, 0, 0]}>
                <sphereGeometry args={[0.09, 16, 16]} />
                <meshStandardMaterial
                  color={GREEN}
                  roughness={0.2}
                  emissive={GREEN}
                  emissiveIntensity={0.15}
                />
              </mesh>
              {/* Pupila reactiva */}
              <mesh ref={ref} position={[0.055, 0, 0]}>
                <sphereGeometry args={[0.058, 16, 16]} />
                <meshStandardMaterial color={INK} roughness={0.1} />
              </mesh>
              {/* Brillo del ojo */}
              <mesh position={[0.09, 0.04, s * 0.025]}>
                <sphereGeometry args={[0.025, 8, 8]} />
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
              <mesh position={[0.07, -0.02, s * -0.02]}>
                <sphereGeometry args={[0.012, 8, 8]} />
                <meshBasicMaterial color="#FFFFFF" transparent opacity={0.7} />
              </mesh>
            </group>
          ))}

          {/* ─── Gafas de pasta moradas (#3A2370 / #6A4DAB) ─── */}
          <group position={[0.3, 0.12, 0]}>
            {/* Lentes con tinte morado */}
            {[-1, 1].map((s) => (
              <mesh key={`lens-${s}`} position={[0.04, 0, s * 0.51]}>
                <boxGeometry args={[0.32, 0.26, 0.035]} />
                <meshStandardMaterial
                  color={PURPLE}
                  transparent
                  opacity={0.18}
                  roughness={0.05}
                  metalness={0.3}
                />
              </mesh>
            ))}
            {/* Marcos rectangulares con bordes redondeados */}
            {[-1, 1].map((s) => (
              <mesh
                key={`frame-${s}`}
                position={[0.04, 0, s * 0.52]}
                rotation={[0, 0, Math.PI / 4]}
                scale={[1.1, 0.9, 1]}
              >
                <torusGeometry args={[0.22, 0.038, 12, 4]} />
                <meshStandardMaterial
                  color={PURPLE_DEEP}
                  roughness={0.25}
                  metalness={0.2}
                />
              </mesh>
            ))}
            {/* Puente frontal */}
            <mesh position={[0.22, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.028, 0.028, 1.04, 10]} />
              <meshStandardMaterial color={PURPLE_DEEP} roughness={0.25} metalness={0.15} />
            </mesh>
            {/* Patillas */}
            {[-1, 1].map((s) => (
              <mesh key={`temple-${s}`} position={[-0.24, 0.04, s * 0.51]}>
                <boxGeometry args={[0.48, 0.045, 0.035]} />
                <meshStandardMaterial color={PURPLE_DEEP} roughness={0.25} metalness={0.15} />
              </mesh>
            ))}
            {/* Brillo en los cristales */}
            {[-1, 1].map((s) => (
              <mesh key={`glare-${s}`} position={[0.12, 0.06, s * 0.51]}>
                <boxGeometry args={[0.06, 0.1, 0.004]} />
                <meshBasicMaterial color="#FFFFFF" transparent opacity={0.4} />
              </mesh>
            ))}
          </group>

          {/* Mejillas rosadas */}
          {[-1, 1].map((s) => (
            <mesh key={`cheek-${s}`} position={[0.35, -0.08, s * 0.38]}>
              <sphereGeometry args={[0.06, 10, 10]} />
              <meshStandardMaterial
                color="#FDA4AF"
                transparent
                opacity={0.35}
                roughness={0.6}
              />
            </mesh>
          ))}

          {/* ─── Mandíbula inferior ─── */}
          <group ref={jaw} position={[0.08, -0.24, 0]}>
            <mesh position={[0.48, -0.05, 0]} scale={[1.5, 0.42, 0.68]}>
              <sphereGeometry args={[0.32, 20, 20]} />
              <meshStandardMaterial color={MINT_BELLY} roughness={0.5} />
            </mesh>
            {/* Lengua */}
            <mesh position={[0.55, -0.02, 0]} rotation={[0, 0, 0.1]} scale={[1, 0.4, 0.5]}>
              <sphereGeometry args={[0.12, 12, 12]} />
              <meshStandardMaterial color="#FDA4AF" roughness={0.6} />
            </mesh>
            {/* Dientes inferiores */}
            {teeth.slice(0, 4).map((tn, i) => (
              <mesh key={`lt-${i}`} position={[tn.x, 0.08, 0.14]} scale={tn.s * 0.8}>
                <coneGeometry args={[0.042, 0.14, 8]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.25} />
              </mesh>
            ))}
            {teeth.slice(0, 4).map((tn, i) => (
              <mesh key={`ltb-${i}`} position={[tn.x, 0.08, -0.14]} scale={tn.s * 0.8}>
                <coneGeometry args={[0.042, 0.14, 8]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.25} />
              </mesh>
            ))}
          </group>

          {/* Dientes superiores */}
          {teeth.map((tn, i) => (
            <mesh
              key={`ut-${i}`}
              position={[0.28 + i * 0.15, -0.3, 0.15]}
              rotation={[Math.PI, 0, 0]}
              scale={tn.s}
            >
              <coneGeometry args={[0.045, 0.16, 8]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.25} />
            </mesh>
          ))}
          {teeth.map((tn, i) => (
            <mesh
              key={`utb-${i}`}
              position={[0.28 + i * 0.15, -0.3, -0.15]}
              rotation={[Math.PI, 0, 0]}
              scale={tn.s}
            >
              <coneGeometry args={[0.045, 0.16, 8]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.25} />
            </mesh>
          ))}
        </group>

        {/* ─── Partículas geométricas flotantes ─── */}
        <Float speed={2.2} rotationIntensity={0.8} floatIntensity={0.6}>
          <mesh position={[-1.25, 0.9, 0.45]}>
            <octahedronGeometry args={[0.14]} />
            <meshStandardMaterial color={PURPLE} roughness={0.3} emissive={PURPLE} emissiveIntensity={0.15} />
          </mesh>
        </Float>
        <Float speed={1.8} rotationIntensity={0.7} floatIntensity={0.7}>
          <mesh position={[1.15, 0.55, -0.4]}>
            <boxGeometry args={[0.18, 0.18, 0.18]} />
            <meshStandardMaterial color={GREEN} roughness={0.3} emissive={GREEN} emissiveIntensity={0.1} />
          </mesh>
        </Float>
        <Float speed={2.6} rotationIntensity={1} floatIntensity={0.5}>
          <mesh position={[0.8, 1.4, 0.5]}>
            <tetrahedronGeometry args={[0.1]} />
            <meshStandardMaterial color={PURPLE_GLOW} roughness={0.3} emissive={PURPLE_GLOW} emissiveIntensity={0.2} />
          </mesh>
        </Float>
        <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.8}>
          <mesh position={[-0.9, 1.2, -0.6]}>
            <dodecahedronGeometry args={[0.09]} />
            <meshStandardMaterial color={GREEN_LIGHT} roughness={0.3} emissive={GREEN_LIGHT} emissiveIntensity={0.1} />
          </mesh>
        </Float>
      </group>

      {/* ─── Portátil flotante ─── */}
      <FloatingLaptop />

      {/* ─── Partículas de código ─── */}
      <CodeParticles count={12} />

      {/* ─── Pedestal blanco luminoso ─── */}
      <mesh position={[0, -1.06, 0]}>
        <cylinderGeometry args={[1.18, 1.32, 0.18, 48]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>
      <mesh position={[0, -1.16, 0]}>
        <cylinderGeometry args={[1.38, 1.42, 0.06, 48]} />
        <meshStandardMaterial color="#EFEAF7" roughness={0.4} />
      </mesh>
      {/* Brillo del pedestal */}
      <mesh position={[0, -0.96, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 48]} />
        <meshStandardMaterial
          color="#FFFFFF"
          transparent
          opacity={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* ─── Anillo de selección morado ─── */}
      <mesh ref={selRing} position={[0, -0.96, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.22, 1.32, 48]} />
        <meshStandardMaterial
          color={PURPLE}
          emissive={PURPLE}
          emissiveIntensity={selected || dragging ? 0.8 : 0.15}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.25}
        scale={6}
        blur={2.4}
        far={3}
        color="#3A2370"
      />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   Componente principal exportado:
   Canvas 3D con interacción completa
   ══════════════════════════════════════════════════════════════ */
export default function HeroTRex3D({ roarSignal = 0, spinSignal = 0 }: { roarSignal?: number; spinSignal?: number } = {}) {
  const [webglReady, setWebglReady] = useState(true);
  const [selected, setSelected] = useState(false);
  const [dragging, setDragging] = useState(false);

  const dragStart = useRef({ x: 0, y: 0, moved: false });
  const lastPos = useRef({ x: 0, y: 0 });
  const dragDelta = useRef({ x: 0, y: 0 });
  const pointerNorm = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<THREE.Group>(null);
  const { zoom, zoomRef, zoomIn, zoomOut, reset } = useCameraZoom(containerRef);

  useEffect(() => {
    setWebglReady(hasWebGL());
  }, []);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      pointerNorm.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerNorm.current.y = -((e.clientY / window.innerHeight) * 2 - 1);

      if (dragging) {
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        if (Math.hypot(dx, dy) > 4) dragStart.current.moved = true;
        dragDelta.current.x += e.clientX - lastPos.current.x;
        dragDelta.current.y += e.clientY - lastPos.current.y;
        lastPos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const onPointerUp = () => {
      if (dragging) {
        setDragging(false);
        if (!dragStart.current.moved) {
          setSelected((prev) => !prev);
        }
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelected(false);
        setDragging(false);
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [dragging]);

  if (!webglReady) return <HeroTRexFallback />;

  return (
    <ThreeErrorBoundary fallback={<HeroTRexFallback />}>
      <div
        ref={containerRef}
        onPointerDown={(e) => {
          dragStart.current = { x: e.clientX, y: e.clientY, moved: false };
          lastPos.current = { x: e.clientX, y: e.clientY };
          dragDelta.current = { x: 0, y: 0 };
          setDragging(true);
        }}
        className={`relative h-full w-full select-none bg-gradient-to-br from-[#FFFFFF] via-[#F6F3FB] to-[#EFEAF7] ${
          dragging ? 'cursor-grabbing' : selected ? 'cursor-move' : 'cursor-grab'
        }`}
      >
        {/* Cuadrícula blueprint sutil del estudio */}
        <div aria-hidden className="studio-grid pointer-events-none absolute inset-0 opacity-90" />

        {/* Chips flotantes decorativos */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-4 top-6 z-20 rounded-xl border border-studio-border bg-studio-card/90 px-3 py-1.5 shadow-studio"
        >
          <span className="font-mono text-[10px] font-semibold text-studio-purple-deep">&lt;div&gt;</span>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute right-4 top-6 z-20 rounded-xl border border-studio-border bg-studio-card/90 px-3 py-1.5 shadow-studio"
        >
          <span className="font-mono text-[10px] font-semibold text-studio-green-deep">{'{ 3D: true }'}</span>
        </div>

        {/* Botón/indicador de estado de selección */}
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setSelected((s) => !s)}
          className={`absolute left-1/2 top-5 z-30 -translate-x-1/2 rounded-full border px-3.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] transition-all ${
            selected
              ? 'border-studio-purple-deep bg-studio-purple text-white shadow-brutal'
              : 'border-studio-border bg-studio-card/95 text-studio-ink shadow-studio hover:border-studio-purple'
          }`}
        >
          {selected ? '✓ Seleccionado · mueve el mouse' : '↻ Auto-rotación · clic/arrastra'}
        </button>

        {/* ─── Escena Three.js iluminada tipo estudio ─── */}
        <Canvas
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true }}
          camera={{ position: [0, 0.45, 7], fov: 38, near: 0.1, far: 80 }}
        >
          {/* Iluminación de estudio profesional */}
          <ambientLight intensity={1.4} color="#FFFFFF" />
          <hemisphereLight args={['#FFFFFF', '#EFEAF7', 1.0]} />
          <directionalLight position={[4, 6, 5]} intensity={1.8} color="#FFFFFF" castShadow />
          <directionalLight position={[-4, 3, -3]} intensity={0.9} color="#EDE9FE" />
          <pointLight position={[2.2, 1.8, 2.8]} intensity={8} color={GREEN} distance={12} />
          <pointLight position={[-2, 2, -2]} intensity={4} color={PURPLE_GLOW} distance={10} />
          {/* Rim light para contorno */}
          <directionalLight position={[-3, 2, -5]} intensity={0.6} color="#D9CAF0" />

          <group ref={frameRef}>
            <StudioTRex3D
              selected={selected}
              dragging={dragging}
              dragDelta={dragDelta}
              pointerNorm={pointerNorm}
              roarSignal={roarSignal}
            />
          </group>
          <AutoFrameRig targetRef={frameRef} zoomRef={zoomRef} options={{ padding: 0.16 }} />
        </Canvas>

        {/* Rueda del mouse o botones +/− para acercar/alejar */}
        <ZoomControls
          zoom={zoom}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onReset={reset}
          className="bottom-[112px] right-3"
          label="Zoom del T-Rex procedural"
        />
      </div>
    </ThreeErrorBoundary>
  );
}
