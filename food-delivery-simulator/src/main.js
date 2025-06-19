

// import * as THREE from 'three';
// import GUI from 'lil-gui';

// import { createCameraAndLights } from './js/environment.js';
// import { createGroundAndBuildings } from './js/buildings.js';
// import { loadPlayerModel, updatePlayerAnimation, setBuildings, startOrder } from './js/playerModel.js';
// import { WeatherSystem } from './js/weather.js';

// const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xaadfff);

// const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// document.body.appendChild(renderer.domElement);

// const {
//   camera,
//   lights,
//   params: sunParams,
//   directionalLight,
//   updateSunPosition,
// } = createCameraAndLights(renderer.domElement, scene);
// lights.forEach(light => scene.add(light));

// const infoPanel = document.getElementById('infoPanel');

// // 用来显示提示，文本传入这里更新HTML
// function showHint(message) {
//   infoPanel.textContent = message;
//   // 3秒后清空提示
//   clearTimeout(showHint._timeout);
//   showHint._timeout = setTimeout(() => {
//     infoPanel.textContent = '';
//   }, 3000);
// }

// (async () => {
//   const buildings = await createGroundAndBuildings(scene);
//   setBuildings(buildings);

//   loadPlayerModel(scene, camera, renderer, () => {
//     // 模型加载后启动订单，目标配送点名需与 buildings 名称匹配
//     startOrder('delivery2');
//   });

//   const weather = new WeatherSystem(scene, camera);

//   const gui = new GUI();
//   const sunFolder = gui.addFolder('太阳光');
//   sunFolder.add(sunParams, 'intensity', 0, 2, 0.01).name('强度').onChange(v => directionalLight.intensity = v);
//   sunFolder.add(sunParams, 'timeOfDay', 0, 24, 0.01).name('时间 (时)').onChange(updateSunPosition);
//   sunFolder.add(sunParams, 'animateSun').name('自动日夜循环');
//   sunFolder.open();

//   const weatherFolder = gui.addFolder('天气系统');
//   weatherFolder.add(weather.params, 'weatherType', ['None', 'Rain', 'Snow']).name('天气类型').onChange(v => weather.setWeatherType(v));
//   weatherFolder.add(weather.params, 'intensity', 0, 1, 0.01).name('强度').onChange(v => weather.setIntensity(v));
//   weatherFolder.open();

//   const clock = new THREE.Clock();
//   const dayDurationSeconds = 600;
//   const hoursPerSecond = 24 / dayDurationSeconds;

//   function animate() {
//     requestAnimationFrame(animate);
//     const delta = clock.getDelta();
//     // 传入 showHint 让 playerModel 里调用，显示交互文本
//     updatePlayerAnimation(delta, showHint);
//     weather.update();
//     if (sunParams.animateSun) {
//       sunParams.timeOfDay += delta * hoursPerSecond;
//       if (sunParams.timeOfDay > 24) sunParams.timeOfDay -= 24;
//       updateSunPosition();
//     }
//     renderer.render(scene, camera);
//   }
//   animate();

//   window.addEventListener('resize', () => {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//   });
// })();



import * as THREE from 'three';
import GUI from 'lil-gui';

import { createCameraAndLights } from './js/environment.js';
import { createGroundAndBuildings } from './js/buildings.js';
import { loadPlayerModel, updatePlayerAnimation, setBuildings, startOrder } from './js/playerModel.js';
import { WeatherSystem } from './js/weather.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaadfff);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const {
  camera,
  lights,
  params: sunParams,
  directionalLight,
  updateSunPosition,
} = createCameraAndLights(renderer.domElement, scene);
lights.forEach(light => scene.add(light));

const infoPanel = document.getElementById('infoPanel');
const orderInfo = document.getElementById('orderInfo');

function showHint(message) {
  infoPanel.textContent = message;
  clearTimeout(showHint._timeout);
  showHint._timeout = setTimeout(() => {
    infoPanel.textContent = '';
  }, 3000);
}

(async () => {
  const buildings = await createGroundAndBuildings(scene);
  setBuildings(buildings);

  loadPlayerModel(scene, camera, renderer, () => {
    // 生成随机订单配送点
    const deliveryPoints = buildings.filter(b => b.name.startsWith('delivery'));
    if (deliveryPoints.length === 0) {
      console.warn('没有找到任何配送点！');
      orderInfo.textContent = '当前订单：无配送点';
      return;
    }
    const randomIndex = Math.floor(Math.random() * deliveryPoints.length);
    const chosenDelivery = deliveryPoints[randomIndex].name;

    startOrder(chosenDelivery);

    orderInfo.textContent = `当前订单：去配送点 "${chosenDelivery}"`;
  });

  const weather = new WeatherSystem(scene, camera);

  const gui = new GUI();
  const sunFolder = gui.addFolder('太阳光');
  sunFolder.add(sunParams, 'intensity', 0, 2, 0.01).name('强度').onChange(v => directionalLight.intensity = v);
  sunFolder.add(sunParams, 'timeOfDay', 0, 24, 0.01).name('时间 (时)').onChange(updateSunPosition);
  sunFolder.add(sunParams, 'animateSun').name('自动日夜循环');
  sunFolder.open();

  const weatherFolder = gui.addFolder('天气系统');
  weatherFolder.add(weather.params, 'weatherType', ['None', 'Rain', 'Snow']).name('天气类型').onChange(v => weather.setWeatherType(v));
  weatherFolder.add(weather.params, 'intensity', 0, 1, 0.01).name('强度').onChange(v => weather.setIntensity(v));
  weatherFolder.open();

  const clock = new THREE.Clock();
  const dayDurationSeconds = 600;
  const hoursPerSecond = 24 / dayDurationSeconds;

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    updatePlayerAnimation(delta, showHint);
    weather.update();
    if (sunParams.animateSun) {
      sunParams.timeOfDay += delta * hoursPerSecond;
      if (sunParams.timeOfDay > 24) sunParams.timeOfDay -= 24;
      updateSunPosition();
    }
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
