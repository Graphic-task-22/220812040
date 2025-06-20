


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
  setDeliveryHook,
  getPlayerPosition,
  getCameraMode,
  resetPlayerState,
  getScore,
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

// UI 元素
const infoPanel = document.getElementById('infoPanel');
const orderInfo = document.getElementById('orderInfo');
const timer = document.getElementById('timer');
const scoreBoard = document.getElementById('scoreBoard');
const winPanel = document.getElementById('winPanel'); // 胜利提示
const restartBtn = document.getElementById('restartBtn'); // 重新开始按钮

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

// 所有配送点
let deliveryPoints = [];
let currentTarget = null;
let gameEnded = false;

// 小箭头
// 替换你的箭头定义为如下：
const arrowLength = 2.5;  // 更长一点
const arrowColor = 0x00ff88;  // 鲜绿色，更醒目
const arrowDir = new THREE.Vector3(0, 0, -1); // 初始方向
const arrowOrigin = new THREE.Vector3(0, 0, 0);

const arrow = new THREE.ArrowHelper(arrowDir, arrowOrigin, arrowLength, arrowColor);
arrow.visible = false;
scene.add(arrow);


// 重置函数
restartBtn.addEventListener('click', () => {
  resetGame();
  tryPointerLock(); // ✅ 用户点击后触发 Pointer Lock，不会报错
});

function resetGame() {
  resetPlayerState();
  currentTarget = null;
  gameEnded = false;
  winPanel.style.display = 'none';
  arrow.visible = false;

  setTimeout(() => {
    generateOrder();
    tryPointerLock();
  }, 500);
}

// 尝试重新锁定鼠标
function tryPointerLock() {
  if (getCameraMode() === 'first') {
    if (document.pointerLockElement !== document.body) {
      document.body.requestPointerLock();
    }
  }
}

// 生成订单
function generateOrder() {
  if (gameEnded || deliveryPoints.length === 0) return;
  const random = deliveryPoints[Math.floor(Math.random() * deliveryPoints.length)];
  currentTarget = random;
  startOrder(random.name, 120);
  arrow.visible = true;
}

setDeliveryHook(() => {
  arrow.visible = false;
  if (getScore() >= 1) {
    gameEnded = true;
    winPanel.style.display = 'block';
    return;
  }
  setTimeout(generateOrder, 1000);
});

restartBtn.addEventListener('click', resetGame);

(async () => {
  const buildings = await createGroundAndBuildings(scene);
  setBuildings(buildings);
  setUIHooks(showHint, updateUI);

  deliveryPoints = buildings.filter(b => b.name.startsWith('delivery'));

  loadPlayerModel(scene, camera, renderer, () => {
    generateOrder();
    tryPointerLock();
  });

  const weather = new WeatherSystem(scene, camera);
  const gui = new GUI();

  const sunFolder = gui.addFolder('太阳光');
  sunFolder.add(sunParams, 'intensity', 0, 2, 0.01).name('强度').onChange(v => {
    directionalLight.intensity = v;
  });
  sunFolder.add(sunParams, 'timeOfDay', 0, 24, 0.01).name('时间 (时)').onChange(() => {
    updateSunPosition();
  });
  sunFolder.add(sunParams, 'animateSun').name('自动日夜循环');
  sunFolder.open();

  const weatherFolder = gui.addFolder('天气系统');
  weatherFolder
    .add(weather.params, 'weatherType', ['None', 'Rain', 'Snow'])
    .name('天气类型')
    .onChange(v => weather.setWeatherType(v));
  weatherFolder
    .add(weather.params, 'intensity', 0, 1, 0.01)
    .name('强度')
    .onChange(v => weather.setIntensity(v));
  weatherFolder.open();

  const clock = new THREE.Clock();
  const dayDurationSeconds = 600;
  const hoursPerSecond = 24 / dayDurationSeconds;

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    if (!gameEnded) updatePlayerAnimation(delta);
    weather.update();

    // 箭头跟随
  if (arrow.visible && currentTarget) {
  const playerPos = getPlayerPosition();
  const targetPos = new THREE.Vector3();
  currentTarget.getWorldPosition(targetPos);
  const dir = new THREE.Vector3().subVectors(targetPos, playerPos).normalize();

  // 箭头距离更远一点，并贴地显示
  const forwardOffset = dir.clone().setY(0).normalize().multiplyScalar(2.5); // 往前放2.5米
  const arrowPos = playerPos.clone().add(forwardOffset);
  arrowPos.y = 1; // 贴地稍微浮起
  arrow.position.copy(arrowPos);
  arrow.setDirection(dir);
}


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

  setInterval(() => {
    if (!gameEnded && orderInfo.textContent === '当前订单：无') {
      generateOrder();
    }
  }, 1000);
})();
