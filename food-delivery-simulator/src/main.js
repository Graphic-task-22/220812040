
import * as THREE from 'three';
import GUI from 'lil-gui';

import { createCameraAndLights } from './js/environment.js';
import { createGroundAndBuildings } from './js/buildings.js';
import {
  loadPlayerModel,
  updatePlayerAnimation,
  setBuildings,
  startOrder,
  setUIHooks,
} from './js/playerModel.js';

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
const timer = document.getElementById('timer');
const scoreBoard = document.getElementById('scoreBoard');

function showHint(msg) {
  infoPanel.textContent = msg;
  clearTimeout(showHint._t);
  showHint._t = setTimeout(() => (infoPanel.textContent = ''), 3000);
}

function updateUI(orderName, time, score) {
  orderInfo.textContent = orderName ? `当前订单：${orderName}` : '当前订单：无';
  timer.textContent = `剩余时间：${time} 秒`;
  scoreBoard.textContent = `得分：${score}`;
}

(async () => {
  const buildings = await createGroundAndBuildings(scene);
  setBuildings(buildings);

  setUIHooks(showHint, updateUI);

  const deliveryPoints = buildings.filter(b => b.name.startsWith('delivery'));

  function generateOrder() {
    const random = deliveryPoints[Math.floor(Math.random() * deliveryPoints.length)];
    if (random) startOrder(random.name, 120);
  }

  loadPlayerModel(scene, camera, renderer, () => {
    generateOrder();
  });

  const weather = new WeatherSystem(scene, camera);

  const gui = new GUI();
  const sunFolder = gui.addFolder('太阳光');
  sunFolder.add(sunParams, 'intensity', 0, 2, 0.01).name('强度').onChange(v => directionalLight.intensity = v);
  sunFolder.add(sunParams, 'timeOfDay', 0, 24, 0.01).name('时间 (时)').onChange(() => updateSunPosition());
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

  // 每秒检查是否需要新订单
  setInterval(() => {
    if (orderInfo.textContent === '当前订单：无') {
      generateOrder();
    }
  }, 1000);
})();
