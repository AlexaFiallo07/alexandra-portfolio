'use client';

import { Suspense, useMemo, useRef, type RefObject } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import AutoFrameRig from '@/components/3d/AutoFrameRig';
import { BED_DEPTH, BED_WIDTH } from './constants';
import DustBurst from './DustBurst';
import Fossil from './Fossil';
import Terrain from './Terrain';
import { getWoodMaps } from './textures';
import type { DigPoint, DustApi, ExcavationPhase, ExcavationTool, Specimen } from './types';

interface ExcavationSceneProps {
  specimen: Specimen;
  tool: ExcavationTool;
  phase: ExcavationPhase;
  onProgress: (value: number) => void;
  inspectDrag: RefObject<{ x: number; y: number }>;
}

/** Caja de campo de madera con esquinas metálicas y fondo de tierra oscura. */
function Crate() {
  const maps = useMemo(() => getWoodMaps(), []);
  const wood = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#FFFFFF',
        map: maps.map,
        normalMap: maps.normalMap,
        normalScale: new THREE.Vector2(0.7, 0.7),
        roughnessMap: maps.roughnessMap,
        aoMap: maps.aoMap,
        roughness: 0.82,
        metalness: 0.02,
      }),
    [maps],
  );
  const metal = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#8A8A96', metalness: 0.72, roughness: 0.34 }),
    [],
  );
  const darkSoil = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#4A3B2C', roughness: 1 }),
    [],
  );

  return (
    <group>
      <mesh position={[0, -0.62, 0]} receiveShadow material={wood}>
        <boxGeometry args={[BED_WIDTH + 0.24, 0.1, BED_DEPTH + 0.24]} />
      </mesh>
      <mesh position={[0, -0.56, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={darkSoil}>
        <planeGeometry args={[BED_WIDTH, BED_DEPTH]} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh
            position={[0, -0.02, side * (BED_DEPTH / 2 + 0.07)]}
            castShadow
            receiveShadow
            material={wood}
          >
            <boxGeometry args={[BED_WIDTH + 0.24, 0.36, 0.12]} />
          </mesh>
          <mesh
            position={[side * (BED_WIDTH / 2 + 0.07), -0.02, 0]}
            castShadow
            receiveShadow
            material={wood}
          >
            <boxGeometry args={[0.12, 0.36, BED_DEPTH + 0.24]} />
          </mesh>
        </group>
      ))}
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <mesh
            key={`${sx}-${sz}`}
            position={[sx * (BED_WIDTH / 2 + 0.07), 0.16, sz * (BED_DEPTH / 2 + 0.07)]}
            castShadow
            material={metal}
          >
            <boxGeometry args={[0.2, 0.1, 0.2]} />
          </mesh>
        )),
      )}
    </group>
  );
}

/**
 * Escena R3F del yacimiento: HDRI procedural con Lightformers + sol direccional
 * con sombras PCF suaves, todo sobre materiales PBR.
 */
export default function ExcavationScene({
  specimen,
  tool,
  phase,
  onProgress,
  inspectDrag,
}: ExcavationSceneProps) {
  const queue = useRef<DigPoint[]>([]);
  const dustApi = useRef<DustApi>({});
  const frameRef = useRef<THREE.Group>(null);
  const fixedZoom = useRef(1);
  // Conserva la mirada inclinada original del yacimiento.
  const cameraDirection = useMemo(() => new THREE.Vector3(0, 3.05, 4.35), []);

  return (
    <Canvas
      shadows="soft"
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      camera={{ position: [0, 3.05, 4.35], fov: 38, near: 0.1, far: 80 }}
      style={{ touchAction: 'none' }}
    >
      <color attach="background" args={['#F6F3FB']} />
      <fog attach="fog" args={['#F6F3FB', 9, 17]} />

      <ambientLight intensity={0.38} color="#FFFFFF" />
      <hemisphereLight args={['#FFFFFF', '#E4DCF1', 0.5]} />
      <directionalLight
        castShadow
        position={[3.6, 6.2, 2.8]}
        intensity={2.5}
        color="#FFF6E8"
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-camera-near={0.5}
        shadow-camera-far={18}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />

      {/* HDRI procedural: se puede cambiar por <Environment preset="studio" /> o un .hdr */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.4} color="#FFFFFF" position={[0, 5, -3]} scale={[6, 4, 1]} />
        <Lightformer form="circle" intensity={1.5} color="#FFF1D6" position={[-4, 2, 3]} scale={3} />
        <Lightformer form="ring" intensity={0.9} color="#D9CAF0" position={[4, 1.5, -2]} scale={3} />
      </Environment>

      <group ref={frameRef}>
        <Crate />
        <Terrain
          specimen={specimen}
          tool={tool}
          enabled={phase === 'digging'}
          queue={queue}
          dustApi={dustApi}
          onProgress={onProgress}
        />
        <Suspense fallback={null}>
          <Fossil specimen={specimen} phase={phase} inspectDrag={inspectDrag} />
        </Suspense>
        <DustBurst api={dustApi} />
      </group>
      <AutoFrameRig
        targetRef={frameRef}
        zoomRef={fixedZoom}
        options={{ padding: 0.1, mode: 'box', direction: cameraDirection }}
      />
      <ContactShadows
        position={[0, -0.5, 0]}
        opacity={0.2}
        scale={7}
        blur={2.6}
        far={2.6}
        color="#3A2370"
      />
    </Canvas>
  );
}
