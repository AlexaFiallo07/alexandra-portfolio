'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  Sparkles,
  useAnimations,
  useGLTF,
} from '@react-three/drei';
import * as THREE from 'three';
import ModelGate from '@/components/3d/ModelGate';
import SkinMat, { DINO_SKIN } from '@/components/3d/SkinMat';
import { MODEL_CLIPS, MODEL_FILES, MODEL_PATHS } from '@/lib/modelFiles';
import { findClip, fitModel } from '@/lib/model3d';

/* Paleta Studio Light: esmeralda + morado, coherente con el diseño de Antigravity */
const SKIN_DARK = DINO_SKIN.dark;
const CLAW = DINO_SKIN.claw;
const FRAME = '#7C3AED';
const LENS = '#18181B';
const MOUTH = '#7A3B3B';
const TONGUE = '#B96565';

interface HeroTRex3DProps {
  /** Contador externo de clics: permite rugir desde la tarjeta completa. */
  roarSignal?: number;
}

/**
 * Bust de T-Rex con gafas de desarrollador:
 * - las pupilas siguen el cursor del usuario
 * - al hacer clic ruge (abre la mandíbula y ladea la cabeza)
 * - rotación suave + parallax
 */
function TRexBust({ roarSignal = 0 }: HeroTRex3DProps) {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const jaw = useRef<THREE.Group>(null);
  const pupilL = useRef<THREE.Mesh>(null);
  const pupilR = useRef<THREE.Mesh>(null);

  const roar = useRef<{ start: number } | null>(null);
  const lastRoar = useRef(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (roarSignal > lastRoar.current) {
      lastRoar.current = roarSignal;
      roar.current = { start: performance.now() / 1000 };
    }
  }, [roarSignal]);

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
        <SkinMat color={SKIN_DARK} />
      </mesh>
      <mesh position={[-0.5, -0.5, 0]} scale={[1.2, 0.7, 1]}>
        <sphereGeometry args={[0.9, 24, 24]} />
        <SkinMat />
      </mesh>

      {/* Franjas dorsales del cuello */}
      {[-0.15, -0.45, -0.75].map((y, i) => (
        <mesh key={`stripe-${i}`} position={[-0.62 - i * 0.08, y + 0.55, 0]} scale={[1, 0.4, 1.15]}>
          <sphereGeometry args={[0.34 - i * 0.03, 12, 12]} />
          <SkinMat color={SKIN_DARK} roughness={1} />
        </mesh>
      ))}

      {/* Hombros musculares */}
      {[-1, 1].map((s) => (
        <mesh key={`shoulder-${s}`} position={[-0.55, -0.15, s * 0.5]} scale={[1.05, 0.85, 0.8]}>
          <sphereGeometry args={[0.5, 20, 20]} />
          <SkinMat />
        </mesh>
      ))}

      {/* Escudos dorsales */}
      {[-0.75, -0.35, 0.05].map((y, i) => (
        <mesh
          key={`scute-${i}`}
          position={[-0.78 - i * 0.05, y + 0.75, 0]}
          rotation={[0, 0, -0.25]}
        >
          <coneGeometry args={[0.12 - i * 0.01, 0.34, 6]} />
          <SkinMat color={SKIN_DARK} roughness={0.95} />
        </mesh>
      ))}

      {/* Brazos pequeños con tres garras */}
      {[-1, 1].map((s) => (
        <group key={`arm-${s}`} position={[-0.25, -0.35, s * 0.62]} rotation={[0, 0, -0.5]}>
          <mesh position={[0.12, -0.12, 0]}>
            <capsuleGeometry args={[0.09, 0.22, 6, 10]} />
            <SkinMat />
          </mesh>
          <mesh position={[0.3, -0.3, 0]}>
            <sphereGeometry args={[0.12, 14, 14]} />
            <SkinMat />
          </mesh>
          {[0, 1, 2].map((c) => (
            <mesh
              key={c}
              position={[0.4, -0.34, (c - 1) * 0.07]}
              rotation={[0, 0, -Math.PI / 2]}
            >
              <coneGeometry args={[0.022, 0.14, 6]} />
              <meshStandardMaterial color={CLAW} roughness={0.4} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Cola de contrapeso que se pierde tras la vitrina */}
      <mesh position={[-1.55, -0.55, 0]} rotation={[0, 0, Math.PI / 2 + 0.22]} scale={[1, 1, 0.8]}>
        <coneGeometry args={[0.42, 1.5, 16]} />
        <SkinMat color={SKIN_DARK} />
      </mesh>

      {/* ---------- Cabeza ---------- */}
      <group ref={head} position={[0, 1.35, 0]}>
        {/* Cráneo */}
        <mesh scale={[1.25, 0.9, 0.9]}>
          <sphereGeometry args={[0.62, 32, 32]} />
          <SkinMat />
        </mesh>

        {/* Hocico superior */}
        <mesh position={[0.78, -0.1, 0]} scale={[1.35, 0.62, 0.72]}>
          <sphereGeometry args={[0.5, 28, 28]} />
          <SkinMat />
        </mesh>
        {/* Punta del hocico */}
        <mesh position={[1.32, -0.16, 0]} scale={[0.7, 0.5, 0.6]}>
          <sphereGeometry args={[0.32, 20, 20]} />
          <SkinMat color={SKIN_DARK} />
        </mesh>
        {/* Narinas */}
        {[-1, 1].map((s) => (
          <mesh key={`nostril-${s}`} position={[1.4, -0.05, s * 0.14]} scale={[1, 0.7, 1]}>
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshStandardMaterial color={CLAW} roughness={1} />
          </mesh>
        ))}

        {/* Osteodermos: pequeñas protuberancias sobre el hocico */}
        {[
          [0.62, 0.2, 0.12],
          [0.92, 0.12, 0.1],
          [1.18, 0.02, 0.08],
          [0.62, 0.2, -0.12],
          [0.92, 0.12, -0.1],
        ].map(([x, y, z], i) => (
          <mesh key={`osteoderm-${i}`} position={[x, y, z]} scale={[1.2, 0.6, 1]}>
            <sphereGeometry args={[0.055, 10, 10]} />
            <SkinMat color={SKIN_DARK} roughness={0.95} />
          </mesh>
        ))}

        {/* Ceja feroz (hueso sobre el ojo) */}
        {[-1, 1].map((s) => (
          <mesh key={`brow-${s}`} position={[0.3, 0.3, s * 0.36]} rotation={[0, 0, -0.16]}>
            <boxGeometry args={[0.5, 0.14, 0.3]} />
            <SkinMat color={SKIN_DARK} />
          </mesh>
        ))}

        {/* ---------- Ojos + pupilas que siguen el cursor ---------- */}
        {[
          { s: 1, ref: pupilL },
          { s: -1, ref: pupilR },
        ].map(({ s, ref }) => (
          <group key={`eye-${s}`} position={[0.34, 0.12, s * 0.4]}>
            {/* Cuenca oscura y párpado inferior */}
            <mesh position={[0, 0, s * -0.05]}>
              <sphereGeometry args={[0.16, 18, 18]} />
              <meshStandardMaterial color="#203A2C" roughness={1} />
            </mesh>
            <mesh position={[-0.01, -0.13, s * 0.03]} scale={[1.25, 0.45, 0.8]}>
              <sphereGeometry args={[0.12, 14, 14]} />
              <SkinMat color={SKIN_DARK} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.13, 20, 20]} />
              <meshPhysicalMaterial color="#FFFFFF" roughness={0.12} clearcoat={1} clearcoatRoughness={0.08} />
            </mesh>
            <mesh ref={ref} position={[0.05, 0, 0]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial color={hovered ? '#7C3AED' : '#18181B'} roughness={0.25} />
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
                color={FRAME}
                emissive={FRAME}
                emissiveIntensity={hovered ? 0.9 : 0.35}
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
          ))}
          {/* Reflejo de estudio en los cristales */}
          {[-1, 1].map((s) => (
            <mesh key={`glint-${s}`} position={[0.09, 0.06, s * 0.45]} rotation={[0, 0, -0.5]}>
              <planeGeometry args={[0.09, 0.028]} />
              <meshBasicMaterial color="#FFFFFF" transparent opacity={0.7} toneMapped={false} />
            </mesh>
          ))}
          {/* Puente */}
          <mesh position={[0.06, 0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.024, 0.024, 0.5, 8]} />
            <meshStandardMaterial color={FRAME} metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Patillas hacia atrás */}
          {[-1, 1].map((s) => (
            <mesh key={`temple-${s}`} position={[-0.18, 0.05, s * 0.5]} rotation={[0, s * 0.5, 0]}>
              <boxGeometry args={[0.5, 0.03, 0.03]} />
              <meshStandardMaterial color={FRAME} metalness={0.7} roughness={0.3} />
            </mesh>
          ))}
        </group>

        {/* ---------- Mandíbula inferior (ruge al clic) ---------- */}
        <group ref={jaw} position={[0.1, -0.3, 0]}>
          {/* Bisagras de la mandíbula */}
          {[-1, 1].map((s) => (
            <mesh key={`hinge-${s}`} position={[-0.28, 0.02, s * 0.36]}>
              <sphereGeometry args={[0.13, 14, 14]} />
              <SkinMat color={SKIN_DARK} />
            </mesh>
          ))}
          <mesh position={[0.6, -0.06, 0]} scale={[1.7, 0.4, 0.66]}>
            <sphereGeometry args={[0.4, 20, 20]} />
            <SkinMat color={SKIN_DARK} />
          </mesh>
          {/* Boca interior */}
          <mesh position={[0.55, 0.06, 0]} scale={[1.4, 0.18, 0.5]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial color={MOUTH} roughness={1} />
            {/* Lengua */}
            <mesh position={[0.52, 0.05, 0]} scale={[1.1, 0.12, 0.34]}>
              <sphereGeometry args={[0.34, 16, 12]} />
              <meshStandardMaterial color={TONGUE} roughness={0.75} />
            </mesh>
          </mesh>
          {/* Dientes inferiores (ambos lados) */}
          {[-1, 1].flatMap((s) =>
            teeth.slice(0, 6).map((tn, i) => (
              <mesh key={`lt-${s}-${i}`} position={[tn.x, 0.1, s * 0.17]} scale={tn.s * 0.85}>
                <coneGeometry args={[0.05, 0.2, 8]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.45} />
              </mesh>
            )),
          )}
          {/* Colmillos */}
          {[-1, 1].map((s) => (
            <mesh key={`fang-${s}`} position={[0.38, 0.12, s * 0.18]} scale={1.15}>
              <coneGeometry args={[0.06, 0.3, 8]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
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
            <meshStandardMaterial color="#FFFFFF" roughness={0.45} />
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
            <meshStandardMaterial color="#FFFFFF" roughness={0.45} />
          </mesh>
        ))}

        {/* Penacho / cresta */}
        {[-0.1, -0.3, -0.5].map((x, i) => (
          <mesh key={`crest-${i}`} position={[x, 0.55 + i * 0.04, 0]} rotation={[0, 0, -0.4 - i * 0.2]}>
            <coneGeometry args={[0.07, 0.26, 6]} />
            <SkinMat color={SKIN_DARK} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  T-Rex GLB (Blender → useGLTF + useAnimations)                       */
/* ------------------------------------------------------------------ */

function HeroTRexGlb({ roarSignal = 0 }: HeroTRex3DProps) {
  const root = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL_PATHS[MODEL_FILES.trexHero]);
  const { actions, names } = useAnimations(animations, root);

  const fit = useMemo(() => fitModel(scene, 2.6, -1.2, 'y'), [scene]);
  const idleName = useMemo(
    () => findClip(names, [MODEL_CLIPS.trexHero.idle]) ?? '',
    [names],
  );
  const roarName = useMemo(
    () => findClip(names, [MODEL_CLIPS.trexHero.roar]) ?? '',
    [names],
  );
  const pupils = useMemo(() => {
    const found: Array<{ object: THREE.Object3D; base: THREE.Vector3 }> = [];
    for (const name of ['PupilL', 'PupilR']) {
      const object = scene.getObjectByName(name);
      if (object) found.push({ object, base: object.position.clone() });
    }
    return found;
  }, [scene]);

  const lastRoar = useRef(0);
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

  const playRoar = useCallback(() => {
    if (reducedMotion) return;
    const roar = roarName ? actions[roarName] : undefined;
    if (!roar) return;

    roar.clampWhenFinished = true;
    roar.reset().setLoop(THREE.LoopOnce, 1).fadeIn(0.12).play();
    const ms = Math.max(roar.getClip().duration, 0.9) * 1000;
    window.setTimeout(() => {
      roar.fadeOut(0.3);
      const idle = idleName ? actions[idleName] : undefined;
      idle?.reset().fadeIn(0.3).play();
    }, ms);
  }, [actions, idleName, reducedMotion, roarName]);

  useEffect(() => {
    if (roarSignal <= lastRoar.current) return;
    lastRoar.current = roarSignal;
    playRoar();
  }, [playRoar, roarSignal]);

  useFrame((state, delta) => {
    const group = root.current;
    if (group) {
      if (!reducedMotion) group.rotation.y += delta * 0.18;
      group.rotation.x = THREE.MathUtils.lerp(
        group.rotation.x,
        -state.pointer.y * 0.14,
        0.06,
      );
      group.position.x = THREE.MathUtils.lerp(
        group.position.x,
        state.pointer.x * 0.14,
        0.06,
      );
    }

    for (const { object, base } of pupils) {
      object.position.x = THREE.MathUtils.lerp(
        object.position.x,
        base.x + state.pointer.x * 0.035,
        0.14,
      );
      object.position.y = THREE.MathUtils.lerp(
        object.position.y,
        base.y + state.pointer.y * 0.028,
        0.14,
      );
    }
  });

  return (
    <group
      ref={root}
      onPointerDown={(e) => {
        e.stopPropagation();
        playRoar();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      <primitive object={scene} scale={fit.scale} position={fit.position} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Escena del hero                                                     */
/* ------------------------------------------------------------------ */

function Exhibit({ roarSignal = 0, glb = false }: HeroTRex3DProps & { glb?: boolean }) {
  return (
    <>
      {/* Iluminación de estudio en tres puntos */}
      <ambientLight intensity={0.7} color="#FFFFFF" />
      <hemisphereLight args={['#FFFFFF', '#D8D8E2', 0.55]} />
      <directionalLight position={[3.5, 5, 2.5]} intensity={1.7} color="#FFFFFF" />
      <directionalLight position={[-3, 2, 1]} intensity={0.6} color="#E8E2F5" />
      {/* Rim morado trasero */}
      <pointLight position={[-2.8, 1.6, -2.4]} intensity={20} color="#7C3AED" distance={14} />
      {/* Relleno verde esmeralda */}
      <pointLight position={[2.4, -0.4, 2.6]} intensity={9} color="#10B981" distance={12} />
      {/* Luz rasante que marca la textura de escamas */}
      <pointLight position={[1.5, 1.2, -2]} intensity={5} color="#FFFFFF" distance={8} />

      {glb && (
        <Suspense fallback={null}>
          <Environment preset="studio" />
        </Suspense>
      )}

      <group position={[0, -0.4, 0]}>
        {glb ? (
          <Suspense fallback={null}>
            <HeroTRexGlb roarSignal={roarSignal} />
          </Suspense>
        ) : (
          <TRexBust roarSignal={roarSignal} />
        )}

        {/* Pedestal de museo: base, cuerpo hexagonal y tapa pulida */}
        <mesh position={[-0.5, -1.78, 0]}>
          <cylinderGeometry args={[1.55, 1.62, 0.1, 48]} />
          <meshStandardMaterial color="#D8D8E2" roughness={0.85} />
        </mesh>
        <mesh position={[-0.5, -1.5, 0]}>
          <cylinderGeometry args={[1.12, 1.36, 0.44, 6]} />
          <meshStandardMaterial color="#F4F4F7" roughness={0.7} metalness={0.05} />
        </mesh>
        <mesh position={[-0.5, -1.27, 0]}>
          <cylinderGeometry args={[1.2, 1.2, 0.06, 48]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.45} metalness={0.12} />
        </mesh>

        {/* Anillo escáner y filete dorado-morado */}
        <mesh position={[-0.5, -1.26, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.2, 0.022, 10, 90]} />
          <meshStandardMaterial
            color="#7C3AED"
            emissive="#7C3AED"
            emissiveIntensity={0.65}
            metalness={0.4}
            roughness={0.3}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[-0.5, -1.72, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.5, 0.012, 8, 80]} />
          <meshStandardMaterial color="#10B981" metalness={0.5} roughness={0.35} />
        </mesh>
      </group>

      <ContactShadows
        position={[0, -2.2, 0]}
        opacity={0.18}
        scale={9}
        blur={2.8}
        far={3.5}
        color="#5B21B6"
      />

      {/* Partículas moradas de estudio */}
      <Sparkles
        count={45}
        scale={[7, 5, 5]}
        position={[0, 0.4, 0]}
        size={2.6}
        speed={0.3}
        opacity={0.35}
        color="#7C3AED"
      />
    </>
  );
}

/**
 * Vitrina 3D del hero: usa trex_hero.glb cuando está disponible y mantiene
 * el bust procedural como respaldo. Mirada al cursor, rugido y rotación 360°.
 */
export default function HeroTRex3D({ roarSignal = 0 }: HeroTRex3DProps) {
  const canvasProps = {
    dpr: [1, 1.75] as [number, number],
    gl: { antialias: true, alpha: true },
    camera: { position: [0, 0.4, 6.4] as [number, number, number], fov: 40 },
  };

  const procedural = (
    <Canvas {...canvasProps}>
      <Exhibit roarSignal={roarSignal} />
    </Canvas>
  );

  const withGlb = (
    <Canvas {...canvasProps}>
      <Exhibit roarSignal={roarSignal} glb />
    </Canvas>
  );

  return (
    <ModelGate
      file={MODEL_FILES.trexHero}
      fallback={procedural}
      label="Cargando T-Rex GLB…"
    >
      {withGlb}
    </ModelGate>
  );
}
