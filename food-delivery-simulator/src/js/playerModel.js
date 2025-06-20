

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let cameraMode = 'first';
let mixer = null;
let model = null;
let actions = {};
let currentAction = null;
let moveDirection = new THREE.Vector3();
const speed = 0.1;
const keys = { w: false, a: false, s: false, d: false, shift: false };

let camera = null;
let buildings = [];
let buildingBoxes = [];

let firstPersonYaw = 0;
let firstPersonPitch = 0;
let isPointerLocked = false;

let hasOrder = false;
let pickedUp = false;
let orderDeliveryPoint = '';
let remainingTime = 0;
let score = 0;

let showHint = () => {};
let updateUI = () => {};
let onDelivered = () => {};

const audioLoader = new THREE.AudioLoader();
const listener = new THREE.AudioListener();

let walkSound, pickupSound, deliverSound, timeoutSound, wrongDeliverSound;

function initSounds(camera) {
  camera.add(listener);
  walkSound = new THREE.Audio(listener);
  pickupSound = new THREE.Audio(listener);
  deliverSound = new THREE.Audio(listener);
  timeoutSound = new THREE.Audio(listener);
  wrongDeliverSound = new THREE.Audio(listener);

  audioLoader.load('../public/audio/walk.mp3', buffer => {
    walkSound.setBuffer(buffer);
    walkSound.setLoop(true);
    walkSound.setVolume(0.3);
  });
  audioLoader.load('../public/audio/pickup.mp3', buffer => {
    pickupSound.setBuffer(buffer);
    pickupSound.setVolume(0.5);
  });
  audioLoader.load('../public/audio/deliver.mp3', buffer => {
    deliverSound.setBuffer(buffer);
    deliverSound.setVolume(0.5);
  });
  audioLoader.load('../public/audio/timeout.mp3', buffer => {
    timeoutSound.setBuffer(buffer);
    timeoutSound.setVolume(0.5);
  });
  audioLoader.load('../public/audio/failed.mp3', buffer => {
    wrongDeliverSound.setBuffer(buffer);
    wrongDeliverSound.setVolume(0.5);
  });
}

export function setBuildings(b) {
  buildings = b;
  buildingBoxes = b.map(obj => new THREE.Box3().setFromObject(obj));
}

export function setUIHooks(hintCallback, uiCallback) {
  showHint = hintCallback;
  updateUI = uiCallback;
}

export function setDeliveryHook(callback) {
  onDelivered = callback;
}

export function startOrder(deliveryPointName, timeLimit = 30) {
  hasOrder = true;
  pickedUp = false;
  orderDeliveryPoint = deliveryPointName;
  remainingTime = timeLimit;
  window.currentOrderName = deliveryPointName;  // 保存全局订单名
  updateUI(orderDeliveryPoint, Math.ceil(remainingTime), score);
}

export function loadPlayerModel(scene, attachedCamera, renderer, onLoaded) {
  const loader = new GLTFLoader();
  camera = attachedCamera;
  initSounds(camera);

  document.body.addEventListener('click', () => {
    if (!isPointerLocked && cameraMode === 'first') {
      document.body.requestPointerLock();
    }
  });
  document.addEventListener('pointerlockchange', () => {
    isPointerLocked = document.pointerLockElement === document.body;
  });
  document.addEventListener('mousemove', e => {
    if (isPointerLocked && cameraMode === 'first') {
      firstPersonYaw -= e.movementX * 0.002;
      firstPersonPitch -= e.movementY * 0.002;
      firstPersonPitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, firstPersonPitch));
    }
  });

  loader.load('../public/models/RobotExpressive.glb', gltf => {
    model = gltf.scene;
    model.scale.set(1, 1, 1);
    model.position.set(0, 2, 0);

    model.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(model);
    mixer = new THREE.AnimationMixer(model);
    gltf.animations.forEach(clip => {
      actions[clip.name] = mixer.clipAction(clip);
    });
    playAction('Idle');
    setupKeyboardControl();
    if (onLoaded) onLoaded(model);
  });
}

function setupKeyboardControl() {
  window.addEventListener('keydown', e => {
    const key = e.key.toLowerCase();
    if (key === 'c') {
      cameraMode = cameraMode === 'third' ? 'first' : 'third';
      if (cameraMode === 'first') document.body.requestPointerLock();
      else document.exitPointerLock();
    }
    if (keys.hasOwnProperty(key)) keys[key] = true;
  });
  window.addEventListener('keyup', e => {
    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) keys[key] = false;
  });
}

function playAction(name) {
  if (currentAction === name || !actions[name]) return;
  const next = actions[name];
  if (currentAction) actions[currentAction].fadeOut(0.3);
  next.reset().fadeIn(0.3).play();
  currentAction = name;
}

function checkCollision(newPos) {
  if (!model) return false;
  const box = new THREE.Box3().setFromObject(model).translate(new THREE.Vector3().subVectors(newPos, model.position));
  return buildingBoxes.some(bb => box.intersectsBox(bb));
}

function checkProximity() {
  if (!model) return;
  const pos = new THREE.Vector3();
  model.getWorldPosition(pos);

  for (const b of buildings) {
    const box = new THREE.Box3().setFromObject(b);
    if (box.distanceToPoint(pos) < 5) {
      if (b.name === 'restaurant') {
        if (!pickedUp && hasOrder) {
          pickedUp = true;
          showHint('✅ 已取货');
          pickupSound.play();
        }
      }
      if (b.name.startsWith('delivery')) {
        if (!hasOrder) return;
        if (!pickedUp) {
          showHint('⚠️ 先去餐厅取货');
          return;
        }
        if (b.name === orderDeliveryPoint) {
          showHint('📦 外卖已送达');
          deliverSound.play();
          hasOrder = false;
          pickedUp = false;
          orderDeliveryPoint = '';
          remainingTime = 0;
          score++;
          window.currentOrderName = '';  // 清空当前订单名，箭头将隐藏
          onDelivered();
        } else {
          showHint('❌ 不是该地址的外卖');
          wrongDeliverSound.play();
        }
      }
    }
  }
}

function updateMovement(delta) {
  if (!model) return;
  moveDirection.set(0, 0, 0);
  if (keys.w) moveDirection.z -= 1;
  if (keys.s) moveDirection.z += 1;
  if (keys.a) moveDirection.x -= 1;
  if (keys.d) moveDirection.x += 1;

  if (moveDirection.length() > 0) {
    moveDirection.normalize();
    const moveSpeed = keys.shift ? speed * 2 : speed;
    const worldDirection = moveDirection.clone();
    if (cameraMode === 'first') {
      const camQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, firstPersonYaw, 0));
      worldDirection.applyQuaternion(camQuat);
    }
    const nextPos = model.position.clone().addScaledVector(worldDirection, moveSpeed);
    if (!checkCollision(nextPos)) {
      model.position.copy(nextPos);
      model.rotation.y = Math.atan2(worldDirection.x, worldDirection.z);
      playAction(keys.shift ? 'Running' : 'Walking');
      checkProximity();
      if (!walkSound.isPlaying) walkSound.play();
    } else {
      playAction('Idle');
      walkSound.stop();
    }
  } else {
    playAction('Idle');
    if (walkSound && walkSound.isPlaying) walkSound.stop();
  }
}

function updateCameraFollow() {
  if (!model || !camera) return;
  const pos = new THREE.Vector3();
  model.getWorldPosition(pos);
  if (cameraMode === 'first') {
    const headPos = pos.clone().add(new THREE.Vector3(0, 1.5, 0));
    camera.position.copy(headPos);
    const lookDir = new THREE.Vector3(0, 0, -1)
      .applyAxisAngle(new THREE.Vector3(1, 0, 0), firstPersonPitch)
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), firstPersonYaw);
    camera.lookAt(headPos.clone().add(lookDir));
    model.traverse(child => {
      if (child.isMesh) {
        const name = child.name.toLowerCase();
        child.visible = name.includes('arm') || name.includes('leg');
      }
    });
  } else {
    const offset = new THREE.Vector3(-3, 3, -6);
    const rotationY = model.rotation.y;
    const rotatedOffset = offset.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationY);
    camera.position.copy(model.position.clone().add(rotatedOffset));
    camera.lookAt(model.position.clone().add(new THREE.Vector3(0, 2, 0)));
    model.traverse(child => {
      if (child.isMesh) child.visible = true;
    });
  }
}

export function updatePlayerAnimation(delta) {
  if (mixer) mixer.update(delta);
  updateMovement(delta);
  updateCameraFollow();

  if (hasOrder) {
    remainingTime -= delta;
    if (remainingTime <= 0) {
      showHint('⏰ 已超时');
      timeoutSound.play();
      hasOrder = false;
      pickedUp = false;
      orderDeliveryPoint = '';
      remainingTime = 0;
      score--;
      window.currentOrderName = ''; // 订单超时箭头消失
    }
    updateUI(orderDeliveryPoint, Math.ceil(remainingTime), score);
  }
}

// 新增接口：设置摄像机模式
export function setCameraMode(mode) {
  if (mode === 'first' || mode === 'third') {
    cameraMode = mode;
    if (mode === 'first') {
      document.body.requestPointerLock();
    } else {
      document.exitPointerLock();
    }
  }
}

export function getPlayerPosition() {
  if (!model) return new THREE.Vector3();
  const pos = new THREE.Vector3();
  model.getWorldPosition(pos);
  return pos;
}

export function getCameraMode() {
  return cameraMode;
}

// 与您提供的一致，只增加了重置函数与 getScore 入口
// 只展示改动部分，完整文件内容保留不变

export function resetPlayerState() {
  hasOrder = false;
  pickedUp = false;
  orderDeliveryPoint = '';
  remainingTime = 0;
  score = 0;
  currentAction = null;
  window.currentOrderName = '';
  updateUI('', 0, score);
}

export function getScore() {
  return score;
}

