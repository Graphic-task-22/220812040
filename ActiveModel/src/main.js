import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; // 添加轨道控制器
import { initScene, initCamera, initRenderer } from './scene.js';
import { loadModelWithBox } from './loadModel.js';
import { adjustCameraToObject } from './cameraUtils.js';

// 初始化基础组件
const scene = initScene();
const camera = initCamera();
const renderer = initRenderer();
const clock = new THREE.Clock();

// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = true;
controls.minDistance = 1;
controls.maxDistance = 50;
controls.maxPolarAngle = Math.PI / 1.5;

// 关键变量
let mixer, actions = {}, activeAction;
let soldierModel, boxHelper, box3; // 添加 box3 声明

// 加载模型
loadModelWithBox(scene, './models/Soldier.glb')
  .then(({ model, animations, boxHelper: bh, box3: b3 }) => {
    soldierModel = model;
    boxHelper = bh;
    box3 = b3; // 赋值 box3
    
    // 设置模型位置
    soldierModel.position.set(0, 0, 0);
    
    // 调整相机
    adjustCameraToObject(camera, soldierModel);
    
    // 设置控制器目标点
    controls.target.copy(box3.getCenter(new THREE.Vector3()));
    controls.update();
    
    // 打印包围盒尺寸
    const size = new THREE.Vector3();
    box3.getSize(size);
    console.log('包围盒尺寸:', size);
    
    // 初始化动画系统
    mixer = new THREE.AnimationMixer(soldierModel);
    animations.forEach(clip => {
      actions[clip.name] = mixer.clipAction(clip);
    });
    
    // 播放第一个动画
    activeAction = Object.values(actions)[0];
    if (activeAction) activeAction.play();
    
    // 初始化控制面板
    initGUI();
  })
  .catch(error => {
    console.error('模型加载失败:', error);
  });

// 初始化GUI
function initGUI() {
  const gui = new GUI();
  const params = {
    currentAction: Object.keys(actions)[0] || '',
    showBoundingBox: true,
    rotateSpeed: controls.rotateSpeed,
    zoomSpeed: controls.zoomSpeed
  };

  gui.add(params, 'currentAction', Object.keys(actions))
    .name('选择动画')
    .onChange((name) => {
      if (actions[name] && actions[name] !== activeAction) {
        activeAction.fadeOut(0.5);
        activeAction = actions[name];
        activeAction.reset().fadeIn(0.5).play();
      }
    });
  
  gui.add(params, 'showBoundingBox')
    .name('显示包围盒')
    .onChange(visible => {
      boxHelper.visible = visible;
    });
  
  gui.add(params, 'rotateSpeed', 0.1, 2.0, 0.1)
    .name('旋转速度')
    .onChange(speed => {
      controls.rotateSpeed = speed;
    });
  
  gui.add(params, 'zoomSpeed', 0.1, 2.0, 0.1)
    .name('缩放速度')
    .onChange(speed => {
      controls.zoomSpeed = speed;
    });
}

// 动画循环
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  
  if (mixer) mixer.update(delta);
  
  // 更新包围盒 - 现在使用 box3
  if (boxHelper && soldierModel && box3) {
    // 使用 setFromObject 更新包围盒
    box3.setFromObject(soldierModel);
    
    // 更新 BoxHelper 的包围盒
    boxHelper.box.copy(box3);
  }
  
  // 更新控制器
  controls.update();
  
  renderer.render(scene, camera);
}

animate();

// 窗口调整
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});