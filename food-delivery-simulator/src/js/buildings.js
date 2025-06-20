import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { loadCommunityModel } from './community.js'; // ✅ 加载社区模型

let groundMesh = null;

export async function createGroundAndBuildings(scene) {
  const loader = new GLTFLoader();
  const buildings = [];

  // ✅ 添加起伏草地
  const geometry = new THREE.PlaneGeometry(200, 200, 100, 100);
  geometry.rotateX(-Math.PI / 2);
  for (let i = 0; i < geometry.attributes.position.count; i++) {
    const y = Math.sin(i / 5) * 0.5 + Math.random() * 0.3;
    geometry.attributes.position.setY(i, y);
  }
  geometry.computeVertexNormals();

  const texture = new THREE.TextureLoader().load('../public/textures/grass.jpg');
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(20, 20);
  const material = new THREE.MeshLambertMaterial({ map: texture });

  groundMesh = new THREE.Mesh(geometry, material);
  groundMesh.receiveShadow = true;
  scene.add(groundMesh);

  // ✅ 加载社区模型（作为装饰）
  await loadCommunityModel(scene);

  // ✅ 餐厅
  const restaurant = await new Promise(resolve => {
    loader.load('../public/models/R.glb', gltf => {
      const obj = gltf.scene;
      obj.scale.set(20, 20, 20);
      obj.position.set(-20, 0, -20);
      obj.name = 'restaurant';
      obj.traverse(c => {
        if (c.isMesh) {
          c.castShadow = true;
          c.receiveShadow = true;
        }
      });
      scene.add(obj);
      resolve(obj);
    });
  });

  // ✅ 配送点 1
  const delivery1 = await new Promise(resolve => {
    loader.load('../public/models/K.glb', gltf => {
      const obj = gltf.scene;
      obj.scale.set(2, 2, 2);
      obj.rotateY(Math.PI);
      obj.position.set(30, 0, 40);
      obj.name = 'delivery';
      obj.traverse(c => {
        if (c.isMesh) {
          c.castShadow = true;
          c.receiveShadow = true;
        }
      });
      scene.add(obj);
      resolve(obj);
    });
  });

  // ✅ 配送点 2
  const delivery2 = await new Promise(resolve => {
    loader.load('../public/models/B.glb', gltf => {
      const obj = gltf.scene;
      obj.scale.set(2, 2, 2);
      obj.rotateY(-Math.PI/2);
      obj.position.set(30, 0, -20);
      obj.name = 'delivery2';
      obj.traverse(c => {
        if (c.isMesh) {
          c.castShadow = true;
          c.receiveShadow = true;
        }
      });
      scene.add(obj);
      resolve(obj);
    });
  });

  buildings.push(restaurant, delivery1, delivery2);
  return buildings;
}

export function getGroundHeightAt(x, z) {
  if (!groundMesh) return 0;
  const geometry = groundMesh.geometry;
  const positionAttr = geometry.attributes.position;
  const size = 200;
  const segments = 100;
  const half = size / 2;
  const dx = size / segments;

  const i = Math.floor((x + half) / dx);
  const j = Math.floor((z + half) / dx);
  const idx = j * (segments + 1) + i;

  if (idx >= 0 && idx < positionAttr.count) {
    return positionAttr.getY(idx);
  }
  return 0;
}
