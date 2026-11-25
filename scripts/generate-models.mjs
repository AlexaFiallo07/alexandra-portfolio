import * as THREE from 'three';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

/**
 * Genera los tres GLB que consume el portafolio sin depender de Blender.
 * Son modelos procedurales exportados a glTF Binary con animaciones reales.
 * Si luego exportas esculturas desde Blender con los mismos nombres, las reemplazan.
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
/*  Terópodo que corre                                                  */
/* ------------------------------------------------------------------ */
function buildTheropod() {
  const b = new GlbBuilder();
  const skin = b.addMaterial('skin', '#3E9E70', 0.88);
  const dark = b.addMaterial('skin_dark', '#2E7D57', 0.9);
  const belly = b.addMaterial('belly', '#D1FAE5', 0.95);
  const claw = b.addMaterial('claw', '#18181B', 0.55, 0.1);
  const accent = b.addMaterial('accent', '#7C3AED', 0.5, 0.3);
  const crest = b.addMaterial('crest', '#7C3AED', 0.65, 0.1);

  b.addNode('Root');
  b.addNode('Body', {}, 'Root');
  b.addNode('Head', { translation: [1.16, 1.58, 0] }, 'Root');
  b.addNode('Tail', { translation: [-0.78, 0.92, 0] }, 'Root');
  b.addNode('LegL', { translation: [-0.42, 0.78, 0.3] }, 'Root');
  b.addNode('ShinL', { translation: [0.05, -0.42, 0] }, 'LegL');
  b.addNode('LegR', { translation: [-0.42, 0.78, -0.3] }, 'Root');
  b.addNode('ShinR', { translation: [0.05, -0.42, 0] }, 'LegR');
  b.addNode('ArmL', { translation: [0.62, 1.02, 0.22], rotation: quat(0, 0, -0.5) }, 'Root');
  b.addNode('ArmR', { translation: [0.62, 1.02, -0.22], rotation: quat(0, 0, -0.5) }, 'Root');

  const sphere = (r, w = 18, h = 14) => new THREE.SphereGeometry(r, w, h);
  const cone = (r, h, s = 8) => new THREE.ConeGeometry(r, h, s);

  b.addPart('torso', sphere(0.62, 22, 18), skin, 'Body', {
    position: [0, 0.95, 0], scale: [1.25, 0.78, 0.72],
  });
  b.addPart('hip', sphere(0.5), dark, 'Body', {
    position: [-0.5, 0.9, 0], scale: [1, 1.05, 0.9],
  });
  b.addPart('chest', sphere(0.45), skin, 'Body', {
    position: [0.5, 1.0, 0], scale: [1, 0.9, 0.85],
  });
  b.addPart('ventral', sphere(0.5), belly, 'Body', {
    position: [0.1, 0.68, 0], scale: [1.4, 0.5, 0.7],
  });
  for (const [i, x] of [-0.35, 0, 0.35].entries()) {
    b.addPart(`dorsal_${i}`, sphere(0.22 - i * 0.02, 12, 10), dark, 'Body', {
      position: [x, 1.42 - i * 0.03, 0], scale: [1, 0.35, 1.1],
    });
  }
  for (const [i, x] of [0.4, 0.05, -0.3, -0.65].entries()) {
    b.addPart(`spine_${i}`, cone(0.05, 0.16, 4), claw, 'Body', {
      position: [x, 1.5 - i * 0.05, 0], rotation: [0, 0, -0.2],
    });
  }
  for (const [i, x] of [0.55, 0.28, 0.02].entries()) {
    b.addPart(` plume_${i}`.trim(), cone(0.075, 0.34 - i * 0.04, 6), crest, 'Body', {
      position: [x, 1.6 - i * 0.06, 0], rotation: [0, 0, 0.45 + i * 0.12], scale: [1, 1, 0.35],
    });
  }
  b.addPart('neck', new THREE.CylinderGeometry(0.2, 0.32, 0.75, 8), skin, 'Body', {
    position: [0.88, 1.32, 0], rotation: [0, 0, -0.5],
  });

  b.addPart('skull', sphere(0.32, 22, 18), skin, 'Head', { scale: [1.05, 0.75, 0.7] });
  b.addPart('snout', sphere(0.24), dark, 'Head', {
    position: [0.36, -0.06, 0], scale: [1.35, 0.5, 0.55],
  });
  for (const side of [-1, 1]) {
    b.addPart(`nostril_${side}`, sphere(0.022, 8, 6), claw, 'Head', {
      position: [0.56, 0.01, side * 0.07], scale: [1, 0.7, 1],
    });
    b.addPart(`eye_socket_${side}`, sphere(0.075, 12, 10), dark, 'Head', {
      position: [0.2, 0.06, side * 0.22], scale: [1.1, 1, 0.7],
    });
    b.addPart(`eye_${side}`, sphere(0.055, 14, 12), claw, 'Head', {
      position: [0.2, 0.06, side * 0.24],
    });
    b.addPart(`jaw_${side}`, sphere(0.2, 14, 12), belly, 'Head', {
      position: [0.38, -0.2, side * 0.08], scale: [1.5, 0.4, 0.55], rotation: [0, 0, -0.16],
    });
    for (const [i, x] of [0.18, 0.3, 0.42].entries()) {
      b.addPart(`tooth_${side}_${i}`, cone(0.022, 0.09, 6), claw, 'Head', {
        position: [x, 0.09, side * 0.08], rotation: [Math.PI, 0, 0],
      });
    }
  }
  b.addPart('crest', cone(0.09, 0.26, 6), dark, 'Head', {
    position: [-0.06, 0.3, 0], rotation: [0, 0, -0.35], scale: [1, 1, 0.3],
  });

  const tailSegments = [
    [-0.4, 0.02, 0.28, 0.85],
    [-1.05, 0.05, 0.22, 0.75],
    [-1.62, 0.1, 0.16, 0.62],
    [-2.08, 0.16, 0.1, 0.5],
  ];
  tailSegments.forEach(([x, y, r, h], i) => {
    b.addPart(`tail_seg_${i}`, cone(r, h, 10), i > 1 ? dark : skin, 'Tail', {
      position: [x, y, 0], rotation: [0, 0, Math.PI / 2],
    });
  });
  for (const [i, x] of [-0.95, -1.7].entries()) {
    b.addPart(`tail_ring_${i}`, new THREE.TorusGeometry(0.19, 0.012, 6, 20), accent, 'Tail', {
      position: [x, 0.08, 0], rotation: [0, Math.PI / 2, 0],
    });
  }
  b.addPart('tail_tip', cone(0.055, 0.35, 8), dark, 'Tail', {
    position: [-2.38, 0.2, 0], rotation: [0, 0, Math.PI / 2],
  });

  for (const [name, side, shinName] of [
    ['LegL', 1, 'ShinL'], ['LegR', -1, 'ShinR'],
  ]) {
    b.addPart(`${name}_thigh`, sphere(0.3, 16, 12), dark, name, {
      position: [0.05, -0.12, 0], scale: [1, 1.2, 0.75],
    });
    b.addPart(`${shinName}_bone`, new THREE.CylinderGeometry(0.09, 0.13, 0.55, 7), skin, shinName, {
      position: [0, -0.26, 0],
    });
    b.addPart(`${shinName}_ankle`, sphere(0.12, 12, 10), dark, shinName, {
      position: [0.06, -0.44, 0],
    });
    b.addPart(`${shinName}_foot`, new THREE.BoxGeometry(0.36, 0.1, 0.2), dark, shinName, {
      position: [0.1, -0.56, 0],
    });
    for (const [i, z] of [-0.08, 0, 0.08].entries()) {
      b.addPart(`${shinName}_claw_${i}`, cone(0.028, 0.13, 6), claw, shinName, {
        position: [0.31, -0.56, z], rotation: [0, 0, -Math.PI / 2],
      });
    }
  }
  for (const [name, side] of [['ArmL', 1], ['ArmR', -1]]) {
    b.addPart(`${name}_bone`, new THREE.CylinderGeometry(0.045, 0.055, 0.3, 6), dark, name, {
      position: [0.1, -0.12, 0], rotation: [0, 0, -0.5],
    });
    b.addPart(`${name}_claw`, cone(0.03, 0.12, 6), claw, name, {
      position: [0.2, -0.24, 0], rotation: [0, 0, -1.1],
    });
    void side;
  }

  const idleTimes = [0, 0.5, 1];
  b.addAnimation('Idle', [
    { node: 'Root', path: 'translation', times: idleTimes, values: translationTrack([[0, 0, 0], [0, 0.025, 0], [0, 0, 0]]) },
    { node: 'Head', path: 'rotation', times: idleTimes, values: quatTrack(idleTimes, [[0, 0, 0], [0, -0.08, 0.02], [0, 0, 0]]) },
    { node: 'Tail', path: 'rotation', times: idleTimes, values: quatTrack(idleTimes, [[0, 0, 0], [0, 0.12, 0], [0, 0, 0]]) },
  ]);

  const runTimes = [0, 0.25, 0.5, 0.75, 1];
  const phases = [0, Math.PI / 2, Math.PI, Math.PI * 1.5, Math.PI * 2];
  b.addAnimation('Run', [
    { node: 'Root', path: 'translation', times: runTimes, values: translationTrack(phases.map((p) => [0, Math.abs(Math.sin(p)) * 0.07, 0])) },
    { node: 'LegL', path: 'rotation', times: runTimes, values: quatTrack(runTimes, phases.map((p) => [0, 0, Math.sin(p) * 0.85])) },
    { node: 'LegR', path: 'rotation', times: runTimes, values: quatTrack(runTimes, phases.map((p) => [0, 0, Math.sin(p + Math.PI) * 0.85])) },
    { node: 'ShinL', path: 'rotation', times: runTimes, values: quatTrack(runTimes, phases.map((p) => [0, 0, Math.max(0, Math.sin(p + Math.PI * 0.6)) * 1.05])) },
    { node: 'ShinR', path: 'rotation', times: runTimes, values: quatTrack(runTimes, phases.map((p) => [0, 0, Math.max(0, Math.sin(p + Math.PI * 1.6)) * 1.05])) },
    { node: 'Tail', path: 'rotation', times: runTimes, values: quatTrack(runTimes, phases.map((p) => [0, Math.sin(p) * 0.3, Math.sin(p * 0.5) * 0.08])) },
    { node: 'Head', path: 'rotation', times: runTimes, values: quatTrack(runTimes, phases.map((p) => [0, 0, -0.08 + Math.sin(p) * 0.03])) },
  ]);

  const jumpTimes = [0, 0.15, 0.45, 0.75, 0.9];
  b.addAnimation('Jump', [
    { node: 'Root', path: 'translation', times: jumpTimes, values: translationTrack([[0, 0, 0], [0, 0.35, 0], [0, 0.65, 0], [0, 0.25, 0], [0, 0, 0]]) },
    { node: 'Root', path: 'rotation', times: jumpTimes, values: quatTrack(jumpTimes, [[0, 0, 0], [0, 0, 0.05], [0, 0, 0], [0, 0, -0.05], [0, 0, 0]]) },
    { node: 'LegL', path: 'rotation', times: jumpTimes, values: quatTrack(jumpTimes, [[0, 0, 0], [0, 0, 0.7], [0, 0, 1.1], [0, 0, 0.4], [0, 0, 0]]) },
    { node: 'LegR', path: 'rotation', times: jumpTimes, values: quatTrack(jumpTimes, [[0, 0, 0], [0, 0, 0.6], [0, 0, 1.0], [0, 0, 0.35], [0, 0, 0]]) },
    { node: 'Tail', path: 'rotation', times: jumpTimes, values: quatTrack(jumpTimes, [[0, 0, 0], [0, 0, 0.12], [0, 0, 0.25], [0, 0, 0.1], [0, 0, 0]]) },
  ]);

  b.write('theropod_run.glb');
}

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

/* ------------------------------------------------------------------ */
/*  T-Rex del hero                                                      */
/* ------------------------------------------------------------------ */
function buildTrex() {
  const b = new GlbBuilder();
  const skin = b.addMaterial('skin', '#3E9E70', 0.88);
  const dark = b.addMaterial('skin_dark', '#2E7D57', 0.9);
  const belly = b.addMaterial('belly', '#D1FAE5', 0.95);
  const claw = b.addMaterial('claw', '#18181B', 0.55, 0.1);
  const frame = b.addMaterial('frame', '#7C3AED', 0.3, 0.7);
  const lens = b.addMaterial('lens', '#18181B', 0.15, 0.35);
  const white = b.addMaterial('white', '#FFFFFF', 0.45);
  const mouth = b.addMaterial('mouth', '#7A3B3B', 1);
  const tongue = b.addMaterial('tongue', '#B96565', 0.75);

  b.addNode('Root');
  b.addNode('Bust', {}, 'Root');
  b.addNode('Head', { translation: [0, 1.35, 0] }, 'Root');
  b.addNode('Jaw', { translation: [0.1, -0.3, 0] }, 'Head');

  const sphere = (r, w = 20, h = 16) => new THREE.SphereGeometry(r, w, h);
  const cone = (r, h, s = 8) => new THREE.ConeGeometry(r, h, s);

  b.addPart('neck', new THREE.CylinderGeometry(0.5, 0.95, 1.7, 14), dark, 'Bust', {
    position: [-0.55, 0.3, 0], rotation: [0, 0, 0.5], scale: [1, 1, 0.85],
  });
  b.addPart('shoulders', sphere(0.9, 24, 20), skin, 'Bust', {
    position: [-0.5, -0.5, 0], scale: [1.2, 0.7, 1],
  });
  for (const [i, y] of [-0.15, -0.45, -0.75].entries()) {
    b.addPart(`neck_stripe_${i}`, sphere(0.34 - i * 0.03, 12, 10), dark, 'Bust', {
      position: [-0.62 - i * 0.08, y + 0.55, 0], scale: [1, 0.4, 1.15],
    });
  }
  for (const side of [-1, 1]) {
    b.addPart(`shoulder_${side}`, sphere(0.5, 18, 14), skin, 'Bust', {
      position: [-0.55, -0.15, side * 0.5], scale: [1.05, 0.85, 0.8],
    });
    b.addPart(`arm_${side}`, new THREE.CapsuleGeometry(0.09, 0.22, 6, 10), skin, 'Bust', {
      position: [-0.13, -0.47, side * 0.62], rotation: [0, 0, -0.5], scale: [1, 1, 1],
    });
    for (const [i, z] of [-0.07, 0, 0.07].entries()) {
      b.addPart(`arm_claw_${side}_${i}`, cone(0.022, 0.14, 6), claw, 'Bust', {
        position: [0.15, -0.69, side * 0.62 + z], rotation: [0, 0, -Math.PI / 2],
      });
    }
  }
  for (const [i, y] of [-0.75, -0.35, 0.05].entries()) {
    b.addPart(`scute_${i}`, cone(0.12 - i * 0.01, 0.34, 6), dark, 'Bust', {
      position: [-0.78 - i * 0.05, y + 0.75, 0], rotation: [0, 0, -0.25],
    });
  }
  b.addPart('counter_tail', cone(0.42, 1.5, 16), dark, 'Bust', {
    position: [-1.55, -0.55, 0], rotation: [0, 0, Math.PI / 2 + 0.22], scale: [1, 1, 0.8],
  });

  b.addPart('cranium', sphere(0.62, 28, 24), skin, 'Head', { scale: [1.25, 0.9, 0.9] });
  b.addPart('snout', sphere(0.5, 24, 20), skin, 'Head', {
    position: [0.78, -0.1, 0], scale: [1.35, 0.62, 0.72],
  });
  b.addPart('snout_tip', sphere(0.32, 18, 16), dark, 'Head', {
    position: [1.32, -0.16, 0], scale: [0.7, 0.5, 0.6],
  });
  for (const side of [-1, 1]) {
    b.addPart(`nostril_${side}`, sphere(0.05, 10, 8), claw, 'Head', {
      position: [1.4, -0.05, side * 0.14], scale: [1, 0.7, 1],
    });
    b.addPart(`brow_${side}`, new THREE.BoxGeometry(0.5, 0.14, 0.3), dark, 'Head', {
      position: [0.3, 0.3, side * 0.36], rotation: [0, 0, -0.16],
    });
    b.addPart(`eye_socket_${side}`, sphere(0.16, 18, 14), dark, 'Head', {
      position: [0.34, 0.12, side * 0.4],
    });
    b.addPart(`eye_${side}`, sphere(0.13, 20, 16), white, 'Head', {
      position: [0.34, 0.12, side * 0.4],
    });
    b.addPart(`Pupil${side === 1 ? 'L' : 'R'}`, sphere(0.06, 16, 14), claw, 'Head', {
      position: [0.39, 0.12, side * 0.4],
    });
    b.addPart(`lens${side === 1 ? 'L' : 'R'}`, new THREE.BoxGeometry(0.34, 0.3, 0.05), lens, 'Head', {
      position: [0.4, 0.12, side * 0.42], scale: [1, 0.78, 1],
    });
    b.addPart(`frame${side === 1 ? 'L' : 'R'}`, new THREE.TorusGeometry(0.21, 0.028, 10, 4), frame, 'Head', {
      position: [0.4, 0.12, side * 0.42],
    });
    b.addPart(`glint${side === 1 ? 'L' : 'R'}`, new THREE.PlaneGeometry(0.09, 0.028), white, 'Head', {
      position: [0.43, 0.18, side * 0.45], rotation: [0, 0, -0.5],
    });
    b.addPart(`temple${side === 1 ? 'L' : 'R'}`, new THREE.BoxGeometry(0.5, 0.03, 0.03), frame, 'Head', {
      position: [0.16, 0.17, side * 0.5], rotation: [0, side * 0.5, 0],
    });
  }
  b.addPart('glasses_bridge', new THREE.CylinderGeometry(0.024, 0.024, 0.5, 8), frame, 'Head', {
    position: [0.4, 0.16, 0], rotation: [Math.PI / 2, 0, 0],
  });
  for (const [i, [x, y, z]] of [
    [0.62, 0.2, 0.12], [0.92, 0.12, 0.1], [1.18, 0.02, 0.08],
    [0.62, 0.2, -0.12], [0.92, 0.12, -0.1],
  ].entries()) {
    b.addPart(`osteoderm_${i}`, sphere(0.055, 10, 8), dark, 'Head', {
      position: [x, y, z], scale: [1.2, 0.6, 1],
    });
  }

  b.addPart('mouth', sphere(0.4, 16, 14), mouth, 'Jaw', {
    position: [0.55, 0.06, 0], scale: [1.4, 0.18, 0.5],
  });
  b.addPart('tongue', sphere(0.34, 16, 12), tongue, 'Jaw', {
    position: [1.07, 0.11, 0], scale: [1.1, 0.12, 0.34],
  });
  b.addPart('lower_jaw', sphere(0.4, 20, 16), dark, 'Jaw', {
    position: [0.6, -0.06, 0], scale: [1.7, 0.4, 0.66],
  });
  for (const side of [-1, 1]) {
    b.addPart(`hinge_${side}`, sphere(0.13, 14, 12), dark, 'Jaw', {
      position: [-0.28, 0.02, side * 0.36],
    });
    for (const [i, x] of [0.28, 0.44, 0.6, 0.76, 0.92, 1.08].entries()) {
      b.addPart(`lower_tooth_${side}_${i}`, cone(0.05, 0.2, 8), white, 'Jaw', {
        position: [x, 0.1, side * 0.17], scale: 0.85 - i * 0.06,
      });
    }
    b.addPart(`fang_${side}`, cone(0.06, 0.3, 8), white, 'Jaw', {
      position: [0.38, 0.12, side * 0.18], scale: 1.15,
    });
  }
  for (const [i, x] of [0.28, 0.44, 0.6, 0.76, 0.92, 1.08, 1.24].entries()) {
    for (const side of [-1, 1]) {
      b.addPart(`upper_tooth_${side}_${i}`, cone(0.055, 0.24, 8), white, 'Head', {
        position: [x, -0.4, side * 0.18], rotation: [Math.PI, 0, 0], scale: 1 - i * 0.07,
      });
    }
  }
  for (const [i, x] of [-0.1, -0.3, -0.5].entries()) {
    b.addPart(`crest_${i}`, cone(0.07, 0.26, 6), dark, 'Head', {
      position: [x, 0.55 + i * 0.04, 0], rotation: [0, 0, -0.4 - i * 0.2],
    });
  }

  const idleTimes = [0, 0.5, 1];
  b.addAnimation('Idle', [
    { node: 'Jaw', path: 'rotation', times: idleTimes, values: quatTrack(idleTimes, [[0, 0, 0], [0, 0, 0.02], [0, 0, 0]]) },
    { node: 'Head', path: 'rotation', times: idleTimes, values: quatTrack(idleTimes, [[0, 0, 0], [0, -0.03, 0], [0, 0, 0]]) },
  ]);

  const roarTimes = [0, 0.15, 0.35, 0.7, 1];
  b.addAnimation('Roar', [
    { node: 'Jaw', path: 'rotation', times: roarTimes, values: quatTrack(roarTimes, [[0, 0, 0], [0, 0, -0.12], [0, 0, -0.55], [0, 0, -0.5], [0, 0, 0]]) },
    { node: 'Head', path: 'rotation', times: roarTimes, values: quatTrack(roarTimes, [[0, 0, 0], [0, 0.05, 0.06], [0, 0, 0.16], [0, 0, 0.12], [0, 0, 0]]) },
  ]);

  b.write('trex_hero.glb');
}

mkdirSync(OUT_DIR, { recursive: true });
buildTheropod();
buildFossil();
buildTrex();
console.log('Modelos GLB generados en', OUT_DIR);
