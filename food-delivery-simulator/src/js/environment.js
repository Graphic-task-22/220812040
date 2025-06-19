// src/js/environment.js
import * as THREE from 'three';

export function createCameraAndLights(domElement, scene) {
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 10, 30);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.castShadow = true;

  // 阴影范围设置大点覆盖全场景
  const d = 100;
  directionalLight.shadow.camera.left = -d;
  directionalLight.shadow.camera.right = d;
  directionalLight.shadow.camera.top = d;
  directionalLight.shadow.camera.bottom = -d;
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 500;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;

  scene.add(ambientLight);
  scene.add(directionalLight);

  // 参数对象，供GUI和外部调用
  const params = {
    intensity: directionalLight.intensity,
    timeOfDay: 12, // 0~24小时
    animateSun: true,
  };

  function updateSunPosition() {
    // 太阳绕着场景中心绕半圆轨迹移动，模拟太阳升落
    const theta = ((params.timeOfDay / 24) * Math.PI * 2) - Math.PI / 2; // 从-90度开始
    const radius = 100;
    directionalLight.position.set(
      Math.cos(theta) * radius,
      Math.sin(theta) * radius,
      0
    );
    directionalLight.target.position.set(0, 0, 0);
    directionalLight.target.updateMatrixWorld();
  }
  updateSunPosition();

  return {
    camera,
    lights: [ambientLight, directionalLight],
    params,
    directionalLight,
    updateSunPosition,
  };
}
