import * as THREE from "three";
import { Renderer } from "./plane/Renderer";
import { Camera } from "./plane/Camera";
import { player } from "./plane/Player";
import { map, initializeMap } from "./plane/Map";
import "./index.css";
import "./plane/collectUserInput";
import { animatePlayer } from "./plane/animatePlayer";
import { animateVehicles } from "./plane/animateVehicles";
import { DirectionalLight } from "./plane/DirectionalLight";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// // 全局变量
// let renderer, camera, scene, controls;

// // 初始化场景
// scene = new THREE.Scene();
// scene.background = new THREE.Color(0x87ceeb); // 蓝色天空

// scene.add(player); // 添加玩家角色
// // 添加光源
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
// directionalLight.position.set(-100, -100, 200); // 阴影光源
// directionalLight.castShadow = true;
// directionalLight.shadow.mapSize.width = 2048;
// directionalLight.shadow.mapSize.height = 2048;
// directionalLight.shadow.camera.near = 50;
// directionalLight.shadow.camera.far = 400;
// scene.add(directionalLight);


// const dirLight = DirectionalLight();
// scene.add(dirLight);

// // 初始化地图
// initializeMap();
// scene.add(map);

// // 相机设置（正交相机，适应浏览器窗口）
// const viewRatio = window.innerWidth / window.innerHeight;
// camera = new THREE.OrthographicCamera(
//   -window.innerWidth / 2,
//   window.innerWidth / 2,
//   window.innerHeight / 2,
//   -window.innerHeight / 2,
//   100,
//   3000
// );
// camera.up.set(0, 0, 1);
// camera.position.set(400, -400, 400); // 调整位置以适配更大区域
// camera.lookAt(0, 0, 0);

// // 渲染器设置
// renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.setSize(window.innerWidth, window.innerHeight); // 满屏显示
// renderer.shadowMap.enabled = true; // 启用阴影
// document.body.appendChild(renderer.domElement);

// // 视角变化
// let isTopView = true;
// const switchView = () => {
//   if (isTopView) {
//     camera.position.set(400, 400, 400); // 切换到斜视图
//     camera.up.set(0, 0, 1);
//     camera.lookAt(0, 0, 0);
//   } else {
//     camera.position.set(400, -400, 400); // 切换回顶视图
//     camera.up.set(0, 0, 1);
//     camera.lookAt(0, 0, 0);
//   }
//   isTopView = !isTopView;
// };

// // 初始化控制器
// controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor = 0.05;
// controls.minDistance = 300; // 调整最小距离
// controls.maxDistance = 1000; // 调整最大距离

// // 动画循环
// function animate() {
//   requestAnimationFrame(animate);
//   controls.update(); // 更新控制器
//   renderer.render(scene, camera);
// }

// // 窗口大小调整
// window.addEventListener('resize', () => {
//   camera.left = -window.innerWidth / 2;
//   camera.right = window.innerWidth / 2;
//   camera.top = window.innerHeight / 2;
//   camera.bottom = -window.innerHeight / 2;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });

// // 启动动画
// animate();


const scene = new THREE.Scene();
scene.add(player);
scene.add(map);

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight();
dirLight.target = player;
dirLight.position.set(-100, -100, 200);
scene.add(dirLight);
player.add(dirLight);


// const camera = Camera();
// scene.add(camera);
// player.add(camera);

initializeGame();

function initializeGame() {
  initializeMap();
}
// 视角变化
let isTopView = true;
const switchView = () => {
  if (isTopView) {
    camera.position.set(400, 400, 400); // 切换到斜视图
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);
  } else {
    camera.position.set(400, -400, 400); // 切换回顶视图
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);
  }
  isTopView = !isTopView;
};

window.addEventListener('resize', () => {
  camera.left = -window.innerWidth / 2;
  camera.right = window.innerWidth / 2;
  camera.top = window.innerHeight / 2;
  camera.bottom = -window.innerHeight / 2;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


// 先创建渲染器
const renderer = Renderer();
// 使用渲染器的DOM元素创建相机和控制器
const { camera, controls } = Camera(renderer.domElement);

renderer.setAnimationLoop(animate);
function animate() {
  animateVehicles();
  animatePlayer();
  
  // 如果处于跟随模式，更新相机位置跟随玩家
  if (controls.followMode) {
    // 计算相机在玩家后方一定距离的位置
    const offset = new THREE.Vector3(300, -300, 300);
    camera.position.copy(player.position).add(offset);
    
    // 让相机看向玩家
    camera.lookAt(player.position);
    
    // 更新控制器目标
    controls.target.copy(player.position);
  }
  
  // 更新控制器
  controls.update();
  renderer.render(scene, camera);
}

// 添加键盘快捷键切换跟随模式
document.addEventListener('keydown', (event) => {
  if (event.key === 'f' || event.key === 'F') {
    controls.followMode = !controls.followMode;
    if (controls.followMode) {
      console.log("跟随模式开启");
    } else {
      console.log("自由视角模式");
    }
  }
});