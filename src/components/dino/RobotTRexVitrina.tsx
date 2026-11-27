'use client';

import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import AutoFrameRig from '@/components/3d/AutoFrameRig';
import ModelGate from '@/components/3d/ModelGate';
import ZoomControls from '@/components/3d/ZoomControls';
import HeroTRexFallback from '@/components/dino/HeroTRexFallback';
import { ROBO_DINO_SKIN } from '@/components/3d/SkinMat';
import { useCameraZoom } from '@/lib/cameraZoom';
import { useStudioPointer } from '@/lib/dinoInteraction';
import { useDinoMotion } from '@/lib/dinoMotion';
import { MODEL_CLIPS, MODEL_FILES, MODEL_PATHS } from '@/lib/modelFiles';
import { findClip } from '@/lib/model3d';
import { cn } from '@/lib/utils';

interface RobotTRexVitrinaProps {
  className?: string;
}

/**
 * Robot T-Rex que antes era el modelo por defecto del hero, ahora montado en
 * la vitrina de Stack en lugar del cráneo. Conserva el GLB original, los clips
 * `Idle`/`Roar`, las pupilas reactivas, el acabado metálico y la misma
 * interacción de vitrina que el hero: clic para girar/rugir y arrastre manual.
 */
function RobotTRex({
  roarSignal,
  zoomRef,
  selected,
  dragging,
  dragDelta,
  pointerNorm,
}: {
  roarSignal: number;
  zoomRef: MutableRefObject<number>;
  selected: boolean;
  dragging: boolean;
  dragDelta: { current: { x: number; y: number } };
  pointerNorm: { current: { x: number; y: number } };
}) {
  const root = useRef<THREE.Group>(null);
  const frameRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL_PATHS[MODEL_FILES.trexHero]);
  const { actions, names } = useAnimations(animations, root);
  const idleName = useMemo(
    () => findClip(names, [MODEL_CLIPS.trexHero.idle]),
    [names],
  );
  const roarName = useMemo(
    () => findClip(names, [MODEL_CLIPS.trexHero.roar]),
    [names],
  );
  const lastRoar = useRef(0);

  /* Misma vida de vitrina que el hero: auto-rotación suave, selección,
     arrastre manual y giro 360° sumado al clic. */
  useDinoMotion({
    selected,
    dragging,
    dragDelta,
    pointerNorm,
    spinSignal: roarSignal,
    root,
    baseY: -0.25,
    autoSpeed: 0.4,
    breathe: 0.035,
  });

  const pupils = useMemo(() => {
    const found: THREE.Object3D[] = [];
    scene.traverse((object) => {
      if (/pupil/i.test(object.name)) found.push(object);
    });
    return found;
  }, [scene]);
  const pupilBase = useRef(new Map<THREE.Object3D, THREE.Vector3>());

  /* Mismo override de materiales que tenía el hero: acero grafito, juntas
     moradas y LED esmeralda en pupilas/sensores. Los materiales `Robo_*`
     del GLB se respetan. */
  useEffect(() => {
    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      for (const material of materials) {
        if (!(material instanceof THREE.MeshStandardMaterial)) continue;
        const isSensor = /pupil|eye|glow|core/i.test(object.name);
        const isRobotMaterial = (material.name ?? '').startsWith('Robo_');

        if (isSensor && !isRobotMaterial) {
          material.emissive = new THREE.Color(ROBO_DINO_SKIN.glow);
          material.emissiveIntensity = 1.4;
          material.roughness = 0.28;
        } else if (!isRobotMaterial) {
          const { r, g, b } = material.color;
          if (g > r * 1.05 && g > b * 1.05) {
            material.color = new THREE.Color(ROBO_DINO_SKIN.shell);
            material.metalness = 0.78;
            material.roughness = 0.28;
          }
        }
        material.needsUpdate = true;
      }
    });

    pupilBase.current = new Map(
      pupils.map((pupil) => [pupil, pupil.position.clone()]),
    );
  }, [scene, pupils]);

  useEffect(() => {
    const idle = idleName ? actions[idleName] : undefined;
    idle?.reset().fadeIn(0.4).play();
    return () => {
      idle?.fadeOut(0.2);
    };
  }, [actions, idleName]);

  useEffect(() => {
    if (roarSignal <= lastRoar.current) return;
    lastRoar.current = roarSignal;
    const roar = roarName ? actions[roarName] : undefined;
    roar?.reset().setLoop(THREE.LoopOnce, 1).play();
  }, [actions, roarName, roarSignal]);

  /* `useDinoMotion` ya controla la rotación y el desplazamiento del grupo;
     aquí solo seguimos el cursor con las pupilas, respetando su posición base. */
  useFrame(() => {
    const px = THREE.MathUtils.clamp(pointerNorm.current.x, -1, 1);
    const py = THREE.MathUtils.clamp(pointerNorm.current.y, -1, 1);

    pupils.forEach((pupil, index) => {
      const base = pupilBase.current.get(pupil);
      if (!base) return;
      const sign = index === 0 ? -1 : 1;
      pupil.position.x = THREE.MathUtils.lerp(pupil.position.x, base.x + px * 0.02, 0.16);
      pupil.position.y = THREE.MathUtils.lerp(pupil.position.y, base.y + py * 0.02 * sign, 0.16);
    });
  });

  return (
    <>
      <ambientLight intensity={0.9} color="#FFFFFF" />
      <hemisphereLight args={['#FFFFFF', '#EFEAF7', 0.6]} />
      <directionalLight position={[4, 6, 5]} intensity={1.7} color="#FFFFFF" />
      <directionalLight position={[-4, 3, -3]} intensity={0.8} color="#D9CAF0" />
      <pointLight position={[2, 1.5, 3]} intensity={8} color={ROBO_DINO_SKIN.glow} distance={12} />
      <pointLight position={[-2, 1.2, -2]} intensity={6} color={ROBO_DINO_SKIN.joint} distance={10} />
      <Suspense fallback={null}>
        <Environment preset="studio" environmentIntensity={0.8} />
      </Suspense>

      <group ref={frameRef}>
        <group ref={root}>
          <primitive object={scene} />
        </group>
      </group>
      <AutoFrameRig targetRef={frameRef} zoomRef={zoomRef} options={{ padding: 0.16 }} />

      <ContactShadows
        position={[0, -0.1, 0]}
        opacity={0.18}
        scale={8}
        blur={2.6}
        far={3}
        color="#3A2370"
      />
    </>
  );
}

/** Vitrina del robot T-Rex con arrastre manual, giro 360°, rugido y zoom acotado. */
export default function RobotTRexVitrina({ className }: RobotTRexVitrinaProps) {
  const [roarSignal, setRoarSignal] = useState(0);
  const activation = () => setRoarSignal((value) => value + 1);
  const { containerRef, selected, dragging, dragDelta, pointerNorm, onPointerDown, onKeyDownActivate } =
    useStudioPointer(activation);
  const { zoom, zoomRef, zoomIn, zoomOut, reset } = useCameraZoom(containerRef);

  const withGlb = (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0.6, 8], fov: 38, near: 0.1, far: 80 }}
      className="h-full w-full"
    >
      <Suspense fallback={null}>
        <RobotTRex
          roarSignal={roarSignal}
          zoomRef={zoomRef}
          selected={selected}
          dragging={dragging}
          dragDelta={dragDelta}
          pointerNorm={pointerNorm}
        />
      </Suspense>
    </Canvas>
  );

  return (
    <div
      ref={containerRef}
      role="button"
      tabIndex={0}
      aria-label="Seleccionar, arrastrar o girar al robot T-Rex 360°"
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDownActivate}
      className={cn(
        'relative h-full w-full touch-pan-y cursor-grab select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-studio-purple',
        dragging ? 'cursor-grabbing' : selected ? 'cursor-move' : '',
        className,
      )}
    >
      <ModelGate
        file={MODEL_FILES.trexHero}
        fallback={<HeroTRexFallback />}
        label="Cargando robot T-Rex…"
      >
        {withGlb}
      </ModelGate>
      <ZoomControls
        zoom={zoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={reset}
        label="Zoom del robot T-Rex"
      />
    </div>
  );
}
