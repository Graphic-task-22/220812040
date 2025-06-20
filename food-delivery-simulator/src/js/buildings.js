// // src/js/buildings.js
// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// export async function createGroundAndBuildings(scene) {
//   const loader = new GLTFLoader();
//   const buildings = [];

//   // 地面
//   const ground = new THREE.Mesh(
//     new THREE.PlaneGeometry(200, 200),
//     new THREE.MeshLambertMaterial({ color: 0x44aa44 })
//   );
//   ground.rotation.x = -Math.PI / 2;
//   ground.receiveShadow = true;
//   scene.add(ground);

//   // 餐厅
//   const restaurant = await new Promise(resolve => {
//     loader.load('../public/models/R.glb', gltf => {
//       const obj = gltf.scene;
//       obj.scale.set(30, 30, 30);
//       obj.position.set(-70, 0, -70);
//       obj.traverse(c => {
//         if (c.isMesh) {
//           c.castShadow = true;
//           c.receiveShadow = true;
//         }
//       });
//       obj.name = 'restaurant';
//       scene.add(obj);
//       resolve(obj);
//     });
//   });

//   // 配送点1
//   const delivery1 = await new Promise(resolve => {
//     loader.load('../public/models/K.glb', gltf => {
//       const obj = gltf.scene;
//       obj.scale.set(3, 3, 3);
//       obj.rotateY(Math.PI);
//       obj.position.set(70, 0, 70);
//       obj.traverse(c => {
//         if (c.isMesh) {
//           c.castShadow = true;
//           c.receiveShadow = true;
//         }
//       });
//       obj.name = 'delivery';
//       scene.add(obj);
//       resolve(obj);
//     });
//   });

//   // 配送点2（新增）
//   const delivery2 = await new Promise(resolve => {
//     loader.load('../public/models/B.glb', gltf => {
//       const obj = gltf.scene;
//       obj.scale.set(3, 3, 3);
//       obj.rotateY(Math.PI);
//       obj.position.set(0, 0, 80); // 设置第二个配送点的位置
//       obj.traverse(c => {
//         if (c.isMesh) {
//           c.castShadow = true;
//           c.receiveShadow = true;
//         }
//       });
//       obj.name = 'delivery2'; // 注意：唯一名称
//       scene.add(obj);
//       resolve(obj);
//     });
//   });

//   buildings.push(restaurant, delivery1, delivery2);
//   return buildings;
// }

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let groundMesh = null; // 存储地面网格，供 getGroundHeightAt 使用

export async function createGroundAndBuildings(scene) {
  const loader = new GLTFLoader();
  const buildings = [];

  // 地面带起伏 + 草地贴图
  const geometry = new THREE.PlaneGeometry(200, 200, 100, 100);
  geometry.rotateX(-Math.PI / 2);

  // 添加起伏
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

  // 配送点 1
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

  // 配送点 2
  const delivery2 = await new Promise(resolve => {
    loader.load('../public/models/B.glb', gltf => {
      const obj = gltf.scene;
      obj.scale.set(3, 3, 3);
      obj.rotateY(Math.PI);
      obj.position.set(0, 0, 80);
      obj.traverse(c => {
        if (c.isMesh) {
          c.castShadow = true;
          c.receiveShadow = true;
        }
      });
      obj.name = 'delivery2';
      scene.add(obj);
      resolve(obj);
    });
  });

  buildings.push(restaurant, delivery1, delivery2);
  return buildings;
}

// ✅ 新增地形高度采样函数
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
