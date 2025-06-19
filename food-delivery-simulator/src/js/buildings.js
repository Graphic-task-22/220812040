// src/js/buildings.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export async function createGroundAndBuildings(scene) {
  const loader = new GLTFLoader();
  const buildings = [];

  // 地面
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshLambertMaterial({ color: 0x44aa44 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // 餐厅
  const restaurant = await new Promise(resolve => {
    loader.load('../public/models/R.glb', gltf => {
      const obj = gltf.scene;
      obj.scale.set(30, 30, 30);
      obj.position.set(-70, 0, -70);
      obj.traverse(c => {
        if (c.isMesh) {
          c.castShadow = true;
          c.receiveShadow = true;
        }
      });
      obj.name = 'restaurant';
      scene.add(obj);
      resolve(obj);
    });
  });

  // 配送点1
  const delivery1 = await new Promise(resolve => {
    loader.load('../public/models/K.glb', gltf => {
      const obj = gltf.scene;
      obj.scale.set(3, 3, 3);
      obj.rotateY(Math.PI);
      obj.position.set(70, 0, 70);
      obj.traverse(c => {
        if (c.isMesh) {
          c.castShadow = true;
          c.receiveShadow = true;
        }
      });
      obj.name = 'delivery';
      scene.add(obj);
      resolve(obj);
    });
  });

  // 配送点2（新增）
  const delivery2 = await new Promise(resolve => {
    loader.load('../public/models/B.glb', gltf => {
      const obj = gltf.scene;
      obj.scale.set(3, 3, 3);
      obj.rotateY(Math.PI);
      obj.position.set(0, 0, 80); // 设置第二个配送点的位置
      obj.traverse(c => {
        if (c.isMesh) {
          c.castShadow = true;
          c.receiveShadow = true;
        }
      });
      obj.name = 'delivery2'; // 注意：唯一名称
      scene.add(obj);
      resolve(obj);
    });
  });

  buildings.push(restaurant, delivery1, delivery2);
  return buildings;
}
