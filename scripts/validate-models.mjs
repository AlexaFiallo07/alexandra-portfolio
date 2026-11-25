import { readFileSync } from 'node:fs';
import path from 'node:path';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const files = ['theropod_run.glb', 'fossil_skull.glb', 'trex_hero.glb'];
const loader = new GLTFLoader();

for (const file of files) {
  const data = readFileSync(path.resolve('public/models', file));
  const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
  const gltf = await new Promise((resolve, reject) => {
    loader.parse(arrayBuffer, '', resolve, reject);
  });

  let nodes = 0;
  let meshes = 0;
  let invalid = 0;
  const names = [];
  gltf.scene.traverse((node) => {
    nodes += 1;
    names.push(node.name);
    if (!node.isMesh) return;
    meshes += 1;
    const scale = node.scale;
    if (![scale.x, scale.y, scale.z].every((value) => Number.isFinite(value) && value > 0)) {
      invalid += 1;
    }
  });

  const box = new THREE.Box3().setFromObject(gltf.scene);
  const size = box.getSize(new THREE.Vector3());
  const pupils = ['PupilL', 'PupilR'].filter((name) => names.includes(name));

  console.log(
    [
      file,
      `${nodes} nodos`,
      `${meshes} mallas`,
      `${gltf.animations.length} clips (${gltf.animations.map((clip) => clip.name).join(', ')})`,
      `tamano ${size.x.toFixed(2)}x${size.y.toFixed(2)}x${size.z.toFixed(2)}`,
      pupils.length ? `pupilas ${pupils.join('+')}` : '',
      invalid ? `ESCALAS INVALIDAS: ${invalid}` : 'escalas OK',
    ]
      .filter(Boolean)
      .join(' | '),
  );

  if (invalid) process.exitCode = 1;
}
