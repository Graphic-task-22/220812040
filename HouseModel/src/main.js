import * as THREE from 'three';
import { setupScene } from './scene.js';
import createHouse from './house.js';

// 创建 canvas 挂载到页面
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// 设置场景
const { scene, camera, renderer, controls } = setupScene(canvas);

// 添加房子
const house = createHouse();
scene.add(house);

// 动画循环
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // 更新控制器
  renderer.render(scene, camera);
}

animate();
