
// 引入 Three.js 和 GLTF 模型加载器
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// ======================== 全局变量初始化 ========================

// 相机模式：'first' 为第一人称，'third' 为第三人称
let cameraMode = 'first';

// 动画控制器、模型、动画集合、当前动画
let mixer = null;
let model = null;
let actions = {};
let currentAction = null;

// 移动方向向量与速度
let moveDirection = new THREE.Vector3();
const speed = 0.1;

// 键盘按键状态
const keys = { w: false, a: false, s: false, d: false, shift: false };

// Three.js 相机、建筑物对象与包围盒集合
let camera = null;
let buildings = [];
let buildingBoxes = [];

// 回调函数：用于 UI 更新（提示语和订单信息）
let showHint = () => {};
let updateUI = () => {};

// 鼠标控制变量（用于第一人称视角）
let firstPersonYaw = 0;
let firstPersonPitch = 0;
let isPointerLocked = false;

// 订单状态变量
let hasOrder = false;
let pickedUp = false;
let orderDeliveryPoint = '';
let remainingTime = 0;
let score = 0;

// ======================== 公共接口函数 ========================

// 设置当前场景中的建筑物列表（用于碰撞检测）
export function setBuildings(b) {
  buildings = b;
  buildingBoxes = b.map(obj => new THREE.Box3().setFromObject(obj));
}

// 设置交互与 UI 更新函数
export function setUIHooks(hintCallback, uiCallback) {
  showHint = hintCallback;
  updateUI = uiCallback;
}

// 启动新的订单：设置目标、初始化时间限制
export function startOrder(deliveryPointName, timeLimit = 30) {
  hasOrder = true;
  pickedUp = false;
  orderDeliveryPoint = deliveryPointName;
  remainingTime = timeLimit;
  updateUI(orderDeliveryPoint, Math.ceil(remainingTime), score);
}

// 加载玩家模型并设置事件监听
export function loadPlayerModel(scene, attachedCamera, renderer, onLoaded) {
  const loader = new GLTFLoader();
  camera = attachedCamera;

  // 鼠标点击时请求指针锁定（第一人称模式下）
  document.body.addEventListener('click', () => {
    if (!isPointerLocked && cameraMode === 'first') {
      document.body.requestPointerLock();
    }
  });

  // 监听指针锁定状态变化
  document.addEventListener('pointerlockchange', () => {
    isPointerLocked = document.pointerLockElement === document.body;
  });

  // 鼠标移动时更新第一人称视角旋转角度
  document.addEventListener('mousemove', e => {
    if (isPointerLocked && cameraMode === 'first') {
      firstPersonYaw -= e.movementX * 0.002;
      firstPersonPitch -= e.movementY * 0.002;
      firstPersonPitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, firstPersonPitch));
    }
  });

  // 加载 GLB 模型
  loader.load('../public/models/RobotExpressive.glb', gltf => {
    model = gltf.scene;
    model.scale.set(1, 1, 1);
    model.position.set(0, 0, 0);

    // 启用阴影
    model.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.add(model);

    // 加载动画
    mixer = new THREE.AnimationMixer(model);
    gltf.animations.forEach(clip => {
      actions[clip.name] = mixer.clipAction(clip);
    });

    playAction('Idle');
    setupKeyboardControl();

    if (onLoaded) onLoaded(model);
  });
}

// ======================== 控制与更新函数 ========================

// 设置键盘按键事件监听
function setupKeyboardControl() {
  window.addEventListener('keydown', e => {
    const key = e.key.toLowerCase();
    if (key === 'c') {
      // 切换相机模式
      cameraMode = cameraMode === 'third' ? 'first' : 'third';
      if (cameraMode === 'first') {
        document.body.requestPointerLock();
      } else {
        document.exitPointerLock();
      }
    }
    if (keys.hasOwnProperty(key)) keys[key] = true;
  });

  window.addEventListener('keyup', e => {
    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) keys[key] = false;
  });
}

// 播放指定动画
function playAction(name) {
  if (currentAction === name || !actions[name]) return;
  const next = actions[name];
  if (currentAction) actions[currentAction].fadeOut(0.3);
  next.reset().fadeIn(0.3).play();
  currentAction = name;
}

// 碰撞检测：判断目标位置是否与建筑物相交
function checkCollision(newPos) {
  if (!model) return false;
  const box = new THREE.Box3().setFromObject(model).translate(new THREE.Vector3().subVectors(newPos, model.position));
  return buildingBoxes.some(bb => box.intersectsBox(bb));
}

// 检查是否靠近餐厅或配送点
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
          hasOrder = false;
          pickedUp = false;
          orderDeliveryPoint = '';
          score++;
        } else {
          showHint('❌ 不是该地址的外卖');
        }
      }
    }
  }
}

// 根据键盘输入移动角色
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

    // 第一人称移动方向依照鼠标角度
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
    } else {
      playAction('Idle');
    }
  } else {
    playAction('Idle');
  }
}

// 根据视角更新相机位置
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

    // 第一人称只显示手臂和腿
    model.traverse(child => {
      if (child.isMesh) {
        const name = child.name.toLowerCase();
        child.visible = name.includes('arm') || name.includes('leg');
      }
    });
  } else {
    // 第三人称相机位于角色右后方
    const offset = new THREE.Vector3(-3, 3, -6);
    const rotationY = model.rotation.y;
    const rotatedOffset = offset.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationY);
    camera.position.copy(model.position.clone().add(rotatedOffset));
    camera.lookAt(model.position.clone().add(new THREE.Vector3(0, 2, 0)));

    // 显示所有身体部位
    model.traverse(child => {
      if (child.isMesh) child.visible = true;
    });
  }
}

// 每帧更新函数：处理动画、移动、摄像头和订单状态
export function updatePlayerAnimation(delta) {
  if (mixer) mixer.update(delta);
  updateMovement(delta);
  updateCameraFollow();

  if (hasOrder) {
    remainingTime -= delta;
    if (remainingTime <= 0) {
      showHint('⏰ 已超时');
      hasOrder = false;
      pickedUp = false;
      orderDeliveryPoint = '';
      remainingTime = 0;
      score--;
    }
    updateUI(orderDeliveryPoint, Math.ceil(remainingTime), score);
  }
}
