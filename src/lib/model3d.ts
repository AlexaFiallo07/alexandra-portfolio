import * as THREE from 'three';

export type FitAxis = 'x' | 'y' | 'z' | 'max';

/**
 * Ajusta un GLB recién cargado al encuadre de la escena sin depender
 * de la escala con la que fue exportado en Blender.
 */
export function fitModel(
  scene: THREE.Object3D,
  targetSize: number,
  floorY = 0,
  axis: FitAxis = 'y',
) {
  const box = new THREE.Box3().setFromObject(scene);
  if (box.isEmpty()) {
    return { scale: 1, position: new THREE.Vector3(0, floorY, 0) };
  }

  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const extent = axis === 'max' ? Math.max(size.x, size.y, size.z) : size[axis];
  const scale = targetSize / Math.max(extent, 0.001);

  return {
    scale,
    position: new THREE.Vector3(
      -center.x * scale,
      floorY - box.min.y * scale,
      -center.z * scale,
    ),
  };
}

/** Busca un clip por nombre exacto o coincidencia parcial (sin contar mayúsculas). */
export function findClip(names: string[], candidates: string[]): string | undefined {
  for (const candidate of candidates) {
    const needle = candidate.toLowerCase();
    const exact = names.find((name) => name.toLowerCase() === needle);
    if (exact) return exact;
    const partial = names.find((name) => name.toLowerCase().includes(needle));
    if (partial) return partial;
  }
  return undefined;
}

/** Igual que findClip, pero usa el primer clip como respaldo. */
export function pickClip(names: string[], candidates: string[]): string | undefined {
  return findClip(names, candidates) ?? names[0];
}
