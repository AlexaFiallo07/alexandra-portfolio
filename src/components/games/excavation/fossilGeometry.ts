import * as THREE from 'three';

/**
 * Tubo cónico curvado siguiendo una Catmull-Rom. Se usa para garras,
 * apófisis y mandíbulas: radio variable + nervaduras opcionales.
 */
export function createTaperedTube(
  points: THREE.Vector3[],
  radiusAt: (t: number) => number,
  tubularSegments = 56,
  radialSegments = 14,
  ribAmount = 0,
): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal');
  const frames = curve.computeFrenetFrames(tubularSegments, false);
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= tubularSegments; i += 1) {
    const t = i / tubularSegments;
    const center = curve.getPointAt(t);
    const normal = frames.normals[i];
    const binormal = frames.binormals[i];
    const radius =
      radiusAt(t) * (1 + Math.sin(t * Math.PI * 2 * 9) * ribAmount);

    for (let j = 0; j <= radialSegments; j += 1) {
      const v = (j / radialSegments) * Math.PI * 2;
      const cos = Math.cos(v);
      const sin = Math.sin(v);
      const nx = normal.x * cos + binormal.x * sin;
      const ny = normal.y * cos + binormal.y * sin;
      const nz = normal.z * cos + binormal.z * sin;
      positions.push(center.x + nx * radius, center.y + ny * radius, center.z + nz * radius);
      normals.push(nx, ny, nz);
      uvs.push(t, j / radialSegments);
    }
  }

  for (let i = 0; i < tubularSegments; i += 1) {
    for (let j = 0; j < radialSegments; j += 1) {
      const a = i * (radialSegments + 1) + j;
      const b = a + radialSegments + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();
  return geometry;
}

/** Garra de velociraptor: curva descendente con punta finísima. */
export function createClawGeometry(): THREE.BufferGeometry {
  const points = [
    new THREE.Vector3(0, -0.2, 0),
    new THREE.Vector3(0.02, -0.04, 0.03),
    new THREE.Vector3(0.12, 0.14, 0.03),
    new THREE.Vector3(0.26, 0.28, -0.03),
    new THREE.Vector3(0.33, 0.32, -0.14),
  ];
  return createTaperedTube(points, (t) => 0.15 * Math.pow(1 - t, 1.28) + 0.003, 64, 16, 0.035);
}

/** Mandíbula inferior del T-Rex, estrechada hacia la punta. */
export function createJawGeometry(): THREE.BufferGeometry {
  const points = [
    new THREE.Vector3(-0.42, -0.02, 0),
    new THREE.Vector3(-0.16, -0.05, 0),
    new THREE.Vector3(0.18, -0.07, 0),
    new THREE.Vector3(0.5, -0.1, 0),
    new THREE.Vector3(0.68, -0.12, 0),
  ];
  return createTaperedTube(points, (t) => 0.13 * Math.pow(1 - t, 0.65) + 0.035, 48, 12);
}

/** Espiral logarítmica con costillas (ammonite). */
export function createAmmoniteGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector3[] = [];
  const steps = 120;
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const angle = t * Math.PI * 5.1;
    const radius = 0.045 + t * 0.4;
    points.push(
      new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(t * Math.PI) * 0.06,
        Math.sin(angle) * radius,
      ),
    );
  }
  return createTaperedTube(points, (t) => 0.026 + t * 0.082, steps, 12, 0.075);
}

/** Apófisis espinosa de la vértebra. */
export function createSpineGeometry(): THREE.BufferGeometry {
  const points = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.02, 0.16, 0),
    new THREE.Vector3(-0.04, 0.34, 0),
    new THREE.Vector3(-0.02, 0.46, 0),
  ];
  return createTaperedTube(points, (t) => 0.12 * Math.pow(1 - t, 0.8) + 0.008, 36, 12);
}
