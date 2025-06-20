
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

  const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
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

  // 色温相关颜色
  const dayColor = new THREE.Color(0xffffff);      // 白天白光
  const eveningColor = new THREE.Color(0xffa500);  // 傍晚橙色（橙黄）
  const nightColor = new THREE.Color(0x110000);    // 夜晚暗橙色（近似黑暗）

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

    // 根据太阳高度调整光强和颜色
    const heightFactor = Math.sin(theta); // -1 ~ 1，太阳高度比例
    // 光强最低0，最高1
    directionalLight.intensity = Math.max(0, heightFactor);

    // 色温插值
    let color;
    if (heightFactor > 0.3) {
      // 白天时段，白光
      color = dayColor;
    } else if (heightFactor > 0) {
      // 早晚时段，白光过渡到橙色
      const t = (heightFactor) / 0.3; // 0~1
      color = eveningColor.clone().lerp(dayColor, t);
    } else if (heightFactor > -0.3) {
      // 傍晚到夜晚，橙色过渡到暗橙色
      const t = (heightFactor + 0.3) / 0.3; // 0~1
      color = nightColor.clone().lerp(eveningColor, t);
    } else {
      // 夜晚，暗橙色
      color = nightColor;
    }

    directionalLight.color.copy(color);
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
