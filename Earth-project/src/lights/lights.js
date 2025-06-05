// lights/lights.js
// 提供环境光和点光源对象，用于照亮地球表面

import * as THREE from 'three';

// 环境光：柔和照亮整体
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // 🔹适当调低，增强对比度

// 点光源：模拟太阳照射
const pointLight = new THREE.PointLight(0xffffff, 5, 1000); // 强度 5，最大距离 1000
pointLight.position.set(50, 50, 50);

// 添加一个小球体帮助可视化光源位置（可选）
const lightHelper = new THREE.PointLightHelper(pointLight, 10, 0xffff00);

// 如果你在 main.js 中想添加 lightHelper：scene.add(lightHelper);

export { ambientLight, pointLight, lightHelper };
