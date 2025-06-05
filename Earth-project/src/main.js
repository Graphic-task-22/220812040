// main.js
// 项目主入口，负责初始化场景、添加地球、光源和GUI控制，并开启动画循环

import { initScene, renderer, camera, scene } from './scene/initScene.js';
import { createEarth, earth } from './objects/earth.js';import { createNebulaCloud } from './objects/nebula.js';



import { initGUI } from './gui/guiControls.js';
import { ambientLight, pointLight, lightHelper } from './lights/lights.js';


// ✅ 添加旋转开关变量
let isRotating = true;

// 初始化场景、相机、渲染器
initScene();

// 创建地球对象并添加到场景
createEarth();
scene.add(earth);

// 添加光照
scene.add(ambientLight);
scene.add(pointLight);
// scene.add(lightHelper);


// 添加星云带
const nebula = createNebulaCloud(35, 20000);
scene.add(nebula);

// 初始化控制面板，同时传入控制变量修改器
initGUI(earth, ambientLight, pointLight, val => {
  isRotating = val; // GUI 控制开关
});

// 动画循环渲染
function animate() {
  requestAnimationFrame(animate);

  if (isRotating) {
    earth.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
  nebula.rotation.y += 0.001; // 慢速自转，增强立体感
}

animate();
