

// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// let cameraMode = 'third';
// let mixer = null;
// let model = null;
// let actions = {};
// let currentAction = null;
// let moveDirection = new THREE.Vector3();
// const speed = 0.1;

// const keys = { w: false, a: false, s: false, d: false, shift: false };
// let camera = null;
// let controls = null;
// let buildings = [];
// let buildingBoxes = [];

// let hasOrder = false;
// let pickedUp = false;
// let orderDeliveryPoint = '';

// export function setBuildings(b) {
//   buildings = b;
//   buildingBoxes = b.map(obj => new THREE.Box3().setFromObject(obj));
// }

// export function startOrder(deliveryPointName) {
//   hasOrder = true;
//   pickedUp = false;
//   orderDeliveryPoint = deliveryPointName;
//   console.log(`订单开始，目标配送点: ${orderDeliveryPoint}`);
// }

// export function loadPlayerModel(scene, attachedCamera, renderer, onLoaded) {
//   const loader = new GLTFLoader();
//   camera = attachedCamera;

//   controls = new OrbitControls(camera, renderer.domElement);
//   controls.target.set(0, 1, 1);
//   controls.enableDamping = true;

//   loader.load('../public/models/RobotExpressive.glb', gltf => {
//     model = gltf.scene;
//     model.scale.set(0.2, 0.2, 0.2);
//     model.position.set(0, 0, 0);
//     model.traverse(child => {
//       if (child.isMesh) {
//         child.castShadow = true;
//         child.receiveShadow = true;
//       }
//     });
//     scene.add(model);

//     mixer = new THREE.AnimationMixer(model);
//     gltf.animations.forEach(clip => {
//       actions[clip.name] = mixer.clipAction(clip);
//     });

//     playAction('Idle');
//     setupKeyboardControl();

//     if (onLoaded) onLoaded(model);
//   });
// }

// function setupKeyboardControl() {
//   window.addEventListener('keydown', e => {
//     const key = e.key.toLowerCase();
//     if (key === 'c') cameraMode = cameraMode === 'third' ? 'first' : 'third';
//     if (keys.hasOwnProperty(key)) keys[key] = true;
//   });

//   window.addEventListener('keyup', e => {
//     const key = e.key.toLowerCase();
//     if (keys.hasOwnProperty(key)) keys[key] = false;
//   });
// }

// function playAction(name) {
//   if (currentAction === name || !actions[name]) return;
//   const next = actions[name];
//   if (currentAction) actions[currentAction].fadeOut(0.3);
//   next.reset().fadeIn(0.3).play();
//   currentAction = name;
// }

// function checkCollision(newPos) {
//   if (!model) return false;
//   const box = new THREE.Box3().setFromObject(model).translate(new THREE.Vector3().subVectors(newPos, model.position));
//   return buildingBoxes.some(bb => box.intersectsBox(bb));
// }

// function checkProximity(showHint) {
//   if (!model) return;
//   const pos = new THREE.Vector3();
//   model.getWorldPosition(pos);

//   for (const b of buildings) {
//     const box = new THREE.Box3().setFromObject(b);
//     if (box.distanceToPoint(pos) < 5) {
//       if (b.name === 'restaurant') {
//         if (hasOrder && !pickedUp) {
//           pickedUp = true;
//           showHint('✅ 已取货');
//           console.log('已取货，去配送点:', orderDeliveryPoint);
//         }
//       } else if (b.name === orderDeliveryPoint) {
//         if (hasOrder && pickedUp) {
//           showHint('📦 外卖已送达');
//           completeOrder();
//         }
//       } else if (b.name.startsWith('delivery') && b.name !== orderDeliveryPoint) {
//         if (hasOrder && pickedUp) {
//           showHint('❌ 不是该地址的外卖');
//         }
//       }
//     }
//   }
// }

// function completeOrder() {
//   hasOrder = false;
//   pickedUp = false;
//   orderDeliveryPoint = '';
//   console.log('订单已完成');
// }

// function updateMovement(delta, showHint) {
//   if (!model) return;
//   moveDirection.set(0, 0, 0);
//   if (keys.w) moveDirection.z -= 1;
//   if (keys.s) moveDirection.z += 1;
//   if (keys.a) moveDirection.x -= 1;
//   if (keys.d) moveDirection.x += 1;

//   if (moveDirection.length() > 0) {
//     moveDirection.normalize();
//     const moveSpeed = keys.shift ? speed * 2 : speed;
//     const nextPos = model.position.clone().addScaledVector(moveDirection, moveSpeed);

//     if (!checkCollision(nextPos)) {
//       model.position.copy(nextPos);
//       model.rotation.y = Math.atan2(moveDirection.x, moveDirection.z);
//       playAction(keys.shift ? 'Running' : 'Walking');
//       checkProximity(showHint);
//     } else {
//       playAction('Idle');
//     }
//   } else {
//     playAction('Idle');
//   }
// }

// function updateCameraFollow() {
//   if (!model || !camera) return;
//   const pos = new THREE.Vector3();
//   model.getWorldPosition(pos);

//   if (cameraMode === 'first') {
//     const headPos = pos.clone().add(new THREE.Vector3(0, 1, 0));
//     const lookDir = new THREE.Vector3(0, 0, 1).applyQuaternion(model.quaternion);
//     camera.position.lerp(headPos, 0.3);
//     camera.lookAt(headPos.clone().add(lookDir));
//   } else {
//     controls.target.copy(pos);
//     controls.update();
//   }

//   model.visible = cameraMode !== 'first';
// }

// export function updatePlayerAnimation(delta, showHint) {
//   if (mixer) mixer.update(delta);
//   updateMovement(delta, showHint);
//   updateCameraFollow();
// }



import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let cameraMode = 'third';
let mixer = null;
let model = null;
let actions = {};
let currentAction = null;
let moveDirection = new THREE.Vector3();
const speed = 0.1;

const keys = { w: false, a: false, s: false, d: false, shift: false };
let camera = null;
let controls = null;
let buildings = [];
let buildingBoxes = [];

// 订单相关状态
let hasOrder = false;
let pickedUp = false;
let orderDeliveryPoint = '';

export function setBuildings(b) {
  buildings = b;
  buildingBoxes = b.map(obj => new THREE.Box3().setFromObject(obj));
}

export function startOrder(deliveryPointName) {
  hasOrder = true;
  pickedUp = false;
  orderDeliveryPoint = deliveryPointName;
  console.log(`订单开始，目标配送点: ${orderDeliveryPoint}`);
}

export function loadPlayerModel(scene, attachedCamera, renderer, onLoaded) {
  const loader = new GLTFLoader();
  camera = attachedCamera;

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1, 1);
  controls.enableDamping = true;

  loader.load('../public/models/RobotExpressive.glb', gltf => {
    model = gltf.scene;
    model.scale.set(0.2, 0.2, 0.2);
    model.position.set(0, 0, 0);
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
    if (key === 'c') cameraMode = cameraMode === 'third' ? 'first' : 'third';
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

function checkProximity(showHint) {
  if (!model) return;
  const pos = new THREE.Vector3();
  model.getWorldPosition(pos);

  for (const b of buildings) {
    const box = new THREE.Box3().setFromObject(b);
    if (box.distanceToPoint(pos) < 5) {
      if (b.name === 'restaurant') {
        if (!pickedUp) {
          pickedUp = true;
          showHint('✅ 已取货');
        }
      }
      if (b.name.startsWith('delivery')) {
        if (!hasOrder) continue;
        if (!pickedUp) {
          showHint('⚠️ 先去餐厅取货');
          return;
        }
        if (b.name === orderDeliveryPoint) {
          showHint('📦 外卖已送达');
          // 订单完成，清除订单状态
          hasOrder = false;
          pickedUp = false;
          orderDeliveryPoint = '';
        } else {
          showHint('❌ 不是该地址的外卖');
        }
      }
    }
  }
}

function updateMovement(delta, showHint) {
  if (!model) return;
  moveDirection.set(0, 0, 0);
  if (keys.w) moveDirection.z -= 1;
  if (keys.s) moveDirection.z += 1;
  if (keys.a) moveDirection.x -= 1;
  if (keys.d) moveDirection.x += 1;

  if (moveDirection.length() > 0) {
    moveDirection.normalize();
    const moveSpeed = keys.shift ? speed * 2 : speed;
    const nextPos = model.position.clone().addScaledVector(moveDirection, moveSpeed);

    if (!checkCollision(nextPos)) {
      model.position.copy(nextPos);
      model.rotation.y = Math.atan2(moveDirection.x, moveDirection.z);
      playAction(keys.shift ? 'Running' : 'Walking');
      checkProximity(showHint);
    } else {
      playAction('Idle');
    }
  } else {
    playAction('Idle');
  }
}

function updateCameraFollow() {
  if (!model || !camera) return;
  const pos = new THREE.Vector3();
  model.getWorldPosition(pos);

  if (cameraMode === 'first') {
    const headPos = pos.clone().add(new THREE.Vector3(0, 1, 0));
    const lookDir = new THREE.Vector3(0, 0, 1).applyQuaternion(model.quaternion);
    camera.position.lerp(headPos, 0.3);
    camera.lookAt(headPos.clone().add(lookDir));
  } else {
    controls.target.copy(pos);
    controls.update();
  }

  model.visible = cameraMode !== 'first';
}

export function updatePlayerAnimation(delta, showHint = () => {}) {
  if (mixer) mixer.update(delta);
  updateMovement(delta, showHint);
  updateCameraFollow();
}
