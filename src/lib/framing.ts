import * as THREE from 'three';

export type FramingMode = 'sphere' | 'box';

export interface FramingOptions {
  /** FOV vertical de la cámara, en grados. */
  fov: number;
  /** Ancho / alto del canvas. */
  aspect: number;
  /** Margen adicional alrededor de la figura (0.14 = 14 %). */
  padding?: number;
  /** Zoom máximo permitido por `cameraZoom.ts` (se usa para el far plane). */
  maxZoom?: number;
  /** Vector desde el centro de la figura hacia la cámara. */
  direction?: THREE.Vector3;
  /**
   * `sphere` garantiza que la figura quepa aunque gire 360° (por defecto).
   * `box` encuadra con precisión los 8 vértices de la caja; útil en escenas
   * con cámara inclinada y objetos que no rotan (p. ej. el yacimiento).
   */
  mode?: FramingMode;
}

export interface FramingResult {
  center: THREE.Vector3;
  box: THREE.Box3;
  sphere: THREE.Sphere;
  radius: number;
  /** Distancia de la cámara al centro con zoom = 1. */
  distance: number;
  near: number;
  far: number;
  direction: THREE.Vector3;
}

const WORLD_UP = new THREE.Vector3(0, 1, 0);

/**
 * Calcula el encuadre de un objeto a partir de su `Box3` y su
 * `boundingSphere` en coordenadas de mundo. La esfera se usa como cota
 * inferior de distancia porque es invariante a la rotación; la caja se usa
 * para el ajuste preciso y para `near`/`far`.
 */
export function computeFraming(
  object: THREE.Object3D,
  options: FramingOptions,
): FramingResult {
  const direction = (options.direction ?? new THREE.Vector3(0, 0, 1))
    .clone()
    .normalize();

  object.updateWorldMatrix(true, true);
  // `precise = true` respeta vértices deformados y transformaciones anidadas.
  const box = new THREE.Box3().setFromObject(object, true);

  if (box.isEmpty()) {
    return {
      center: new THREE.Vector3(),
      box,
      sphere: new THREE.Sphere(new THREE.Vector3(), 1),
      radius: 1,
      distance: 7,
      near: 0.1,
      far: 80,
      direction,
    };
  }

  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const sphere = box.getBoundingSphere(new THREE.Sphere());
  const radius = Math.max(sphere.radius, 0.001);

  const halfV = THREE.MathUtils.degToRad(Math.max(options.fov, 1)) / 2;
  const halfH = Math.atan(Math.tan(halfV) * Math.max(options.aspect, 0.2));
  const limitingHalf = Math.min(halfV, halfH);
  const padding = Math.max(options.padding ?? 0.14, 0);
  const maxZoom = Math.max(options.maxZoom ?? 1.75, 1.01);

  // Base ortogonal de la cámara para medir cada esquina de la caja.
  const right = new THREE.Vector3().crossVectors(WORLD_UP, direction);
  if (right.lengthSq() < 1e-6) right.set(1, 0, 0);
  right.normalize();
  const up = new THREE.Vector3().crossVectors(direction, right).normalize();

  const tanV = Math.tan(halfV);
  const tanH = Math.tan(halfH);
  let boxDistance = 0;
  const corner = new THREE.Vector3();
  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      for (const sz of [-1, 1]) {
        // Las esquinas ya son relativas al centro de la caja.
        corner.set((sx * size.x) / 2, (sy * size.y) / 2, (sz * size.z) / 2);
        const x = Math.abs(corner.dot(right));
        const y = Math.abs(corner.dot(up));
        const z = corner.dot(direction);
        boxDistance = Math.max(
          boxDistance,
          z + x / tanH,
          z + y / tanV,
        );
      }
    }
  }

  // Distancia necesaria para que una esfera nunca se salga del frustum,
  // incluso al girar 360°. Es la cota conservadora pero segura.
  const sphereDistance = radius / Math.sin(limitingHalf);
  const base =
    options.mode === 'box'
      ? Math.max(boxDistance, radius * 1.05)
      : Math.max(boxDistance * 0.85, sphereDistance);
  const distance = base * (1 + padding);

  // El zoom máximo aleja la cámara; el mínimo la acerca. Ambos extremos
  // deben quedar entre near y far sin recortar la geometría.
  const near = Math.max(0.05, Math.min(distance * 0.08, distance - radius * 1.25));
  const far = distance * maxZoom + radius * 3 + 10;

  return { center, box, sphere, radius, distance, near, far, direction };
}
