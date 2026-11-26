import * as THREE from 'three';

/** Juego de mapas PBR generado por código (sin assets externos). */
export interface PbrMaps {
  map: THREE.DataTexture;
  normalMap: THREE.DataTexture;
  roughnessMap: THREE.DataTexture;
  aoMap: THREE.DataTexture;
}

const clampByte = (value: number) => Math.max(0, Math.min(255, Math.round(value)));

/** Hash determinista: el mismo ruido en todas las sesiones. */
function hash2(x: number, y: number): number {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function valueNoise(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi);
  const b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1);
  const d = hash2(xi + 1, yi + 1);
  return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
}

/** Ruido fractal (fBm) con 5 octavas por defecto. */
function fbm(x: number, y: number, octaves = 5): number {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  let norm = 0;
  for (let i = 0; i < octaves; i += 1) {
    sum += valueNoise(x * freq, y * freq) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return sum / norm;
}

function makeTexture(
  data: Uint8Array,
  size: number,
  repeat: number,
  srgb = false,
): THREE.DataTexture {
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat, repeat);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 8;
  if (srgb) texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/** Normal map derivada del campo de alturas (derivas centrales). */
function normalFromHeight(height: Float32Array, size: number, strength: number): Uint8Array {
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const i = y * size + x;
      const left = height[y * size + ((x - 1 + size) % size)];
      const right = height[y * size + ((x + 1) % size)];
      const up = height[((y - 1 + size) % size) * size + x];
      const down = height[((y + 1) % size) * size + x];
      let nx = (left - right) * strength;
      let ny = (up - down) * strength;
      let nz = 1;
      const len = Math.hypot(nx, ny, nz) || 1;
      nx /= len;
      ny /= len;
      nz /= len;
      const p = i * 4;
      data[p] = clampByte((nx * 0.5 + 0.5) * 255);
      data[p + 1] = clampByte((ny * 0.5 + 0.5) * 255);
      data[p + 2] = clampByte((nz * 0.5 + 0.5) * 255);
      data[p + 3] = 255;
    }
  }
  return data;
}

let soilCache: PbrMaps | null = null;

/** Arena superficial: albedo, normal, roughness y AO. Se cachea una sola vez. */
export function getSoilMaps(): PbrMaps {
  if (soilCache) return soilCache;
  const size = 256;
  const height = new Float32Array(size * size);
  const albedo = new Uint8Array(size * size * 4);
  const roughness = new Uint8Array(size * size * 4);
  const ao = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const i = y * size + x;
      const grain = hash2(x, y);
      const h = fbm((x / size) * 7, (y / size) * 7, 5);
      height[i] = h * 0.76 + grain * 0.24;

      const shade = 0.82 + height[i] * 0.3;
      const p = i * 4;
      albedo[p] = clampByte(214 * shade + grain * 10);
      albedo[p + 1] = clampByte(192 * shade + grain * 8);
      albedo[p + 2] = clampByte(158 * shade + grain * 6);
      albedo[p + 3] = 255;

      const r = clampByte(178 + (1 - height[i]) * 52 + grain * 12);
      roughness[p] = r;
      roughness[p + 1] = r;
      roughness[p + 2] = r;
      roughness[p + 3] = 255;

      const a = clampByte(150 + height[i] * 95);
      ao[p] = a;
      ao[p + 1] = a;
      ao[p + 2] = a;
      ao[p + 3] = 255;
    }
  }

  soilCache = {
    map: makeTexture(albedo, size, 4, true),
    normalMap: makeTexture(normalFromHeight(height, size, 3.2), size, 4),
    roughnessMap: makeTexture(roughness, size, 4),
    aoMap: makeTexture(ao, size, 4),
  };
  return soilCache;
}

let boneCache: PbrMaps | null = null;

/** Hueso mineralizado: marfil envejecido, porosidad y grietas sutiles. */
export function getBoneMaps(): PbrMaps {
  if (boneCache) return boneCache;
  const size = 256;
  const height = new Float32Array(size * size);
  const albedo = new Uint8Array(size * size * 4);
  const roughness = new Uint8Array(size * size * 4);
  const ao = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const i = y * size + x;
      const pore = hash2(x + 31, y + 17);
      const veinNoise = fbm((x / size) * 4 + 13, (y / size) * 4 + 7, 4);
      const vein = Math.abs(veinNoise - 0.5) < 0.045 ? 0.58 : 1;
      const h = fbm((x / size) * 9, (y / size) * 9, 5);
      height[i] = h * 0.62 + pore * 0.26 + (1 - vein) * 0.12;

      const shade = (0.9 + h * 0.16) * vein;
      const p = i * 4;
      albedo[p] = clampByte(238 * shade + pore * 6);
      albedo[p + 1] = clampByte(226 * shade + pore * 5);
      albedo[p + 2] = clampByte(200 * shade + pore * 4);
      albedo[p + 3] = 255;

      const r = clampByte(148 + pore * 44 + (1 - h) * 26);
      roughness[p] = r;
      roughness[p + 1] = r;
      roughness[p + 2] = r;
      roughness[p + 3] = 255;

      const a = clampByte(178 + h * 70 - (1 - vein) * 42);
      ao[p] = a;
      ao[p + 1] = a;
      ao[p + 2] = a;
      ao[p + 3] = 255;
    }
  }

  boneCache = {
    map: makeTexture(albedo, size, 2, true),
    normalMap: makeTexture(normalFromHeight(height, size, 2.4), size, 2),
    roughnessMap: makeTexture(roughness, size, 2),
    aoMap: makeTexture(ao, size, 2),
  };
  return boneCache;
}

let woodCache: PbrMaps | null = null;

/** Madera de campo con veta alargada para la caja de excavación. */
export function getWoodMaps(): PbrMaps {
  if (woodCache) return woodCache;
  const size = 128;
  const height = new Float32Array(size * size);
  const albedo = new Uint8Array(size * size * 4);
  const roughness = new Uint8Array(size * size * 4);
  const ao = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const i = y * size + x;
      const grain = fbm((x / size) * 3, (y / size) * 22, 4);
      const stripe = Math.sin((y / size) * Math.PI * 24 + grain * 3) * 0.5 + 0.5;
      const h = grain * 0.62 + stripe * 0.38;
      height[i] = h;
      const p = i * 4;
      albedo[p] = clampByte(126 + h * 74);
      albedo[p + 1] = clampByte(88 + h * 58);
      albedo[p + 2] = clampByte(54 + h * 42);
      albedo[p + 3] = 255;
      const r = clampByte(158 + h * 54);
      roughness[p] = r;
      roughness[p + 1] = r;
      roughness[p + 2] = r;
      roughness[p + 3] = 255;
      const a = clampByte(174 + h * 66);
      ao[p] = a;
      ao[p + 1] = a;
      ao[p + 2] = a;
      ao[p + 3] = 255;
    }
  }

  woodCache = {
    map: makeTexture(albedo, size, 1, true),
    normalMap: makeTexture(normalFromHeight(height, size, 1.8), size, 1),
    roughnessMap: makeTexture(roughness, size, 1),
    aoMap: makeTexture(ao, size, 1),
  };
  return woodCache;
}
