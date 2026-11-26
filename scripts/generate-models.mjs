import * as THREE from 'three';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

/**
 * Genera el GLB del cráneo fósil. El robot T-Rex de la vitrina se entrega
 * como binario (`trex_hero.glb`) y no se regenera aquí.
 * El resto de las figuras son procedurales (Three.js / SVG).
 */

const OUT_DIR = path.resolve('public/models');
const align4 = (value) => (value + 3) & ~3;

function rgba(hex, alpha = 1) {
  const clean = hex.replace('#', '');
  return [
    Number.parseInt(clean.slice(0, 2), 16) / 255,
    Number.parseInt(clean.slice(2, 4), 16) / 255,
    Number.parseInt(clean.slice(4, 6), 16) / 255,
    alpha,
  ];
}

function quat(x = 0, y = 0, z = 0) {
  return new THREE.Quaternion()
    .setFromEuler(new THREE.Euler(x, y, z))
    .toArray();
}

function quatTrack(times, eulers) {
  return eulers.flatMap(([x, y, z]) => quat(x, y, z));
}

function translationTrack(points) {
  return points.flat();
}

class GlbBuilder {
  constructor() {
    this.nodes = [];
    this.meshes = [];
    this.materials = [];
    this.accessors = [];
    this.bufferViews = [];
    this.viewBuffers = [];
    this.animations = [];
    this.byteLength = 0;
    this.nodeByName = new Map();
  }

  addMaterial(name, hex, roughness = 0.85, metalness = 0) {
    const index = this.materials.length;
    this.materials.push({
      name,
      doubleSided: true,
      pbrMetallicRoughness: {
        baseColorFactor: rgba(hex),
        metallicFactor: metalness,
        roughnessFactor: roughness,
      },
    });
    return index;
  }

  addBufferView(array, target) {
    const source = Buffer.from(array.buffer, array.byteOffset, array.byteLength);
    const byteOffset = align4(this.byteLength);
    const index = this.bufferViews.length;
    this.bufferViews.push({
      buffer: 0,
      byteOffset,
      byteLength: source.length,
      ...(target ? { target } : {}),
    });
    this.viewBuffers[index] = source;
    this.byteLength = byteOffset + source.length;
    return index;
  }

  addAccessor(view, componentType, type, count, extras = {}) {
    const accessor = { bufferView: view, componentType, count, type, ...extras };
    const index = this.accessors.length;
    this.accessors.push(accessor);
    return index;
  }

  addMesh(name, geometry, material) {
    const pos = new Float32Array(geometry.attributes.position.array);
    const nor = new Float32Array(geometry.attributes.normal.array);
    let idx = geometry.index
      ? geometry.index.array
      : Uint16Array.from({ length: pos.length / 3 }, (_, i) => i);
    if (pos.length / 3 > 65535 && !(idx instanceof Uint32Array)) {
      idx = Uint32Array.from(idx);
    }

    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < pos.length; i += 3) {
      for (let axis = 0; axis < 3; axis++) {
        min[axis] = Math.min(min[axis], pos[i + axis]);
        max[axis] = Math.max(max[axis], pos[i + axis]);
      }
    }

    const posAccessor = this.addAccessor(
      this.addBufferView(pos, 34962),
      5126,
      'VEC3',
      pos.length / 3,
      { min, max },
    );
    const norAccessor = this.addAccessor(
      this.addBufferView(nor, 34962),
      5126,
      'VEC3',
      nor.length / 3,
    );
    const idxAccessor = this.addAccessor(
      this.addBufferView(idx, 34963),
      idx instanceof Uint32Array ? 5125 : 5123,
      'SCALAR',
      idx.length,
    );

    const meshIndex = this.meshes.length;
    this.meshes.push({
      name,
      primitives: [
        {
          attributes: { POSITION: posAccessor, NORMAL: norAccessor },
          indices: idxAccessor,
          material,
        },
      ],
    });
    return meshIndex;
  }

  addNode(name, options = {}, parentName) {
    if (this.nodeByName.has(name)) {
      throw new Error(`Nodo duplicado: ${name}`);
    }
    const node = { name };
    if (options.mesh !== undefined) node.mesh = options.mesh;
    if (options.translation) node.translation = options.translation;
    if (options.rotation) node.rotation = options.rotation;
    if (options.scale !== undefined) {
      const scale = options.scale;
      node.scale = typeof scale === 'number' ? [scale, scale, scale] : scale;
    }

    const index = this.nodes.length;
    this.nodes.push(node);
    this.nodeByName.set(name, index);

    if (parentName) {
      const parent = this.nodeByName.get(parentName);
      if (parent === undefined) throw new Error(`Padre inexistente: ${parentName}`);
      this.nodes[parent].children ??= [];
      this.nodes[parent].children.push(index);
    }
    return index;
  }

  addPart(name, geometry, material, parentName, transform = {}) {
    const mesh = this.addMesh(`${name}_mesh`, geometry, material);
    return this.addNode(
      name,
      {
        mesh,
        translation: transform.position ?? [0, 0, 0],
        rotation: quat(...(transform.rotation ?? [0, 0, 0])),
        scale: transform.scale ?? [1, 1, 1],
      },
      parentName,
    );
  }

  addAnimation(name, channels) {
    const samplers = [];
    const gltfChannels = [];

    for (const channel of channels) {
      const node = this.nodeByName.get(channel.node);
      if (node === undefined) throw new Error(`Animación ${name}: nodo ${channel.node} no existe`);

      const times = new Float32Array(channel.times);
      const values = new Float32Array(channel.values);
      const inputAccessor = this.addAccessor(
        this.addBufferView(times),
        5126,
        'SCALAR',
        times.length,
        { min: [Math.min(...times)], max: [Math.max(...times)] },
      );
      const outputAccessor = this.addAccessor(
        this.addBufferView(values),
        5126,
        channel.path === 'rotation' ? 'VEC4' : 'VEC3',
        values.length / (channel.path === 'rotation' ? 4 : 3),
      );

      samplers.push({ input: inputAccessor, output: outputAccessor, interpolation: 'LINEAR' });
      gltfChannels.push({
        sampler: samplers.length - 1,
        target: { node, path: channel.path },
      });
    }

    this.animations.push({ name, samplers, channels: gltfChannels });
  }

  write(fileName) {
    const gltf = {
      asset: { version: '2.0', generator: 'protafolio-procedural-glb' },
      scene: 0,
      scenes: [{ nodes: [this.nodeByName.get('Root')] }],
      nodes: this.nodes,
      meshes: this.meshes,
      materials: this.materials,
      animations: this.animations,
      buffers: [{ byteLength: this.byteLength }],
      bufferViews: this.bufferViews,
      accessors: this.accessors,
    };

    let json = Buffer.from(JSON.stringify(gltf), 'utf8');
    json = Buffer.concat([json, Buffer.alloc(align4(json.length) - json.length, 0x20)]);
    const binLength = align4(this.byteLength);
    const bin = Buffer.alloc(binLength);
    for (let i = 0; i < this.viewBuffers.length; i++) {
      this.viewBuffers[i].copy(bin, this.bufferViews[i].byteOffset);
    }

    const header = Buffer.alloc(12);
    header.writeUInt32LE(0x46546c67, 0);
    header.writeUInt32LE(2, 4);
    header.writeUInt32LE(12 + 8 + json.length + 8 + binLength, 8);

    const jsonHeader = Buffer.alloc(8);
    jsonHeader.writeUInt32LE(json.length, 0);
    jsonHeader.writeUInt32LE(0x4e4f534a, 4);

    const binHeader = Buffer.alloc(8);
    binHeader.writeUInt32LE(bin.length, 0);
    binHeader.writeUInt32LE(0x004e4942, 4);

    const output = path.join(OUT_DIR, fileName);
    writeFileSync(output, Buffer.concat([header, jsonHeader, json, binHeader, bin]));
    const triangles = this.meshes.reduce((total, mesh) => {
      const accessor = this.accessors[mesh.primitives[0].indices];
      return total + accessor.count / 3;
    }, 0);
    console.log(
      `${fileName}: ${this.nodes.length} nodos, ${this.animations.length} clips, ` +
        `${Math.round(triangles)} triángulos, ${(fsStatKib(output)).toFixed(1)} KiB`,
    );
  }
}

function fsStatKib(filePath) {
  const { statSync } = fs;
  return statSync(filePath).size / 1024;
}

import fs from 'node:fs';

/* ------------------------------------------------------------------ */
/*  Cráneo fósil                                                        */
/* ------------------------------------------------------------------ */
function buildFossil() {
  const b = new GlbBuilder();
  const bone = b.addMaterial('bone', '#F4F4F7', 0.82);
  const boneShade = b.addMaterial('bone_shade', '#E8E8EE', 0.88);
  const seam = b.addMaterial('seam', '#D8D8E2', 1);
  const socket = b.addMaterial('socket', '#18181B', 1);
  const accent = b.addMaterial('accent', '#7C3AED', 0.5, 0.25);
  const tooth = b.addMaterial('tooth', '#FFFFFF', 0.65);

  b.addNode('Root');
  b.addNode('Skull', {}, 'Root');

  const sphere = (r, w = 20, h = 16) => new THREE.SphereGeometry(r, w, h);
  const cone = (r, h, s = 8) => new THREE.ConeGeometry(r, h, s);

  b.addPart('cranium', sphere(0.8, 24, 20), bone, 'Skull', {
    position: [-0.28, 0.2, 0], scale: [0.78, 0.6, 0.55],
  });
  b.addPart('snout', sphere(0.62, 22, 18), boneShade, 'Skull', {
    position: [0.68, 0.02, 0], scale: [1.1, 0.32, 0.34],
  });
  b.addPart('snout_tip', sphere(0.36, 16, 14), bone, 'Skull', {
    position: [1.18, -0.06, 0], scale: [0.42, 0.22, 0.26],
  });
  b.addPart('crest', new THREE.BoxGeometry(1, 1, 1), seam, 'Skull', {
    position: [-0.25, 0.62, 0], scale: [0.7, 0.12, 0.5],
  });
  for (const side of [-1, 1]) {
    b.addPart(`zygomatic_${side}`, new THREE.CapsuleGeometry(0.055, 0.72, 6, 10), boneShade, 'Skull', {
      position: [0.2, -0.05, side * 0.4], rotation: [side * 0.25, 0, -0.15],
    });
    b.addPart(`socket_${side}`, sphere(0.2, 18, 14), socket, 'Skull', {
      position: [0.12, 0.26, side * 0.32], scale: [1, 0.82, 0.42],
    });
    b.addPart(`socket_gem_${side}`, sphere(0.055, 12, 10), accent, 'Skull', {
      position: [0.15, 0.28, side * 0.37],
    });
    b.addPart(`jaw_side_${side}`, sphere(0.75, 20, 16), boneShade, 'Skull', {
      position: [0.52, -0.38, side * 0.1], scale: [1.05, 0.16, 0.29], rotation: [0, 0, -0.05],
    });
    for (const [i, x] of [0.32, 0.48, 0.64, 0.8, 0.96, 1.12].entries()) {
      b.addPart(`tooth_${side}_${i}`, cone(0.035, 0.16, 6), tooth, 'Skull', {
        position: [x, -0.18, side * 0.16], rotation: [Math.PI, 0, 0], scale: 1 - i * 0.06,
      });
    }
  }
  b.addPart('nasal', sphere(0.12, 14, 12), socket, 'Skull', {
    position: [1.02, 0.16, 0], rotation: [0, 0, 0.18], scale: [1, 0.72, 0.5],
  });
  for (const [i, config] of [
    [-0.48, 0.42, 0.35, 0.5],
    [0.36, 0.38, 0.28, -0.7],
    [-0.12, 0.52, 0.22, 0.9],
  ].entries()) {
    const [x, y, length, rotation] = config;
    b.addPart(`suture_${i}`, new THREE.BoxGeometry(0.014, length, 0.008), seam, 'Skull', {
      position: [x, y, 0.29], rotation: [0, 0, rotation],
    });
  }

  const times = [0, 0.5, 1];
  b.addAnimation('Idle', [
    { node: 'Skull', path: 'rotation', times, values: quatTrack(times, [[0, 0, 0], [0, 0.035, 0.012], [0, 0, 0]]) },
    { node: 'Skull', path: 'translation', times, values: translationTrack([[0, 0, 0], [0, 0.012, 0], [0, 0, 0]]) },
  ]);
  b.write('fossil_skull.glb');
}

mkdirSync(OUT_DIR, { recursive: true });
buildFossil();
console.log('Modelo GLB generado en', OUT_DIR);
