// import * as THREE from "three";

// export function Camera() {
//   const size = 300;
//   const viewRatio = window.innerWidth / window.innerHeight;
//   const width = viewRatio < 1 ? size : size * viewRatio;
//   const height = viewRatio < 1 ? size / viewRatio : size;

//   const camera = new THREE.OrthographicCamera(
//     width / -2, // left
//     width / 2, // right
//     height / 2, // top
//     height / -2, // bottom
//     100, // near
//     900 // far
//   );

//   camera.up.set(0, 0, 1);
//   camera.position.set(300, -300, 300);
//   camera.lookAt(0, 0, 0);

//   return camera;
// }


import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function Camera(rendererDomElement) {
  const size = 300;
  const viewRatio = window.innerWidth / window.innerHeight;
  const width = viewRatio < 1 ? size : size * viewRatio;
  const height = viewRatio < 1 ? size / viewRatio : size;

  const camera = new THREE.OrthographicCamera(
    width / -2, // left
    width / 2,  // right
    height / 2, // top
    height / -2, // bottom
    100, // near
    900 // far
  );

  camera.up.set(0, 0, 1);
  camera.position.set(300, -300, 300);
  camera.lookAt(0, 0, 0);

  // 创建轨道控制器
  const controls = new OrbitControls(camera, rendererDomElement);
  controls.enableDamping = true;      // 启用阻尼效果
  controls.dampingFactor = 0.05;      // 阻尼系数
  controls.screenSpacePanning = true; // 允许平面平移
  controls.minDistance = 100;         // 最小缩放距离
  controls.maxDistance = 1000;        // 最大缩放距离
  
  // 添加跟随模式切换标志
  controls.followMode = true;
  
  // 返回相机和控制器
  return { camera, controls };
}