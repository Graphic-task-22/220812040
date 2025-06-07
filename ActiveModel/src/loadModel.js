import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

// modelLoader.js
export function loadModelWithBox(scene, modelPath) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(modelPath, (gltf) => {
      const model = gltf.scene;
      
      // 确保模型应用初始变换
      model.updateMatrixWorld(true);
      
      model.traverse(child => {
        if (child.isMesh) {
          child.castShadow = true;
          
          // 重要：确保几何体应用骨骼变换
          if (child.skeleton) {
            child.skinning = true;
          }
        }
      });
      
      const clonedModel = clone(model);
      scene.add(clonedModel);
      
      // 立即更新世界矩阵
      clonedModel.updateMatrixWorld(true);
      
      // 创建包围盒 - 使用Box3Helper替代BoxHelper
      const box3 = new THREE.Box3().setFromObject(clonedModel);
      const boxHelper = new THREE.Box3Helper(box3, 0xff0000);
      scene.add(boxHelper);
      
      resolve({
        model: clonedModel,
        animations: gltf.animations,
        boxHelper,
        box3 // 返回box3用于更新
      });
    }, undefined, reject);
  });
}