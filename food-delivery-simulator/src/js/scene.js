import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls;

export function initScene() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 30, 30);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // 控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();

  // 环境光（AmbientLight），柔和均匀光照
  const ambientLight = new THREE.AmbientLight(0x404040, 1); // 强度0.5
  scene.add(ambientLight);

  // 平行光（DirectionalLight），模拟太阳光直射
  const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
  directionalLight.position.set(20, 40, 20);
  directionalLight.castShadow = true; // 开启阴影（如果需要）
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 100;
  scene.add(directionalLight);

  // 点光源（PointLight），模拟太阳周围散射光
  const pointLight = new THREE.PointLight(0xfff0cc, 6, 100);
  pointLight.position.set(15, 50, 15);
  scene.add(pointLight);

  // 调整渲染器开启阴影支持（如果用阴影的话）
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return { scene, camera, renderer, controls };
}

export function animate(renderCallback) {
  function loop() {
    requestAnimationFrame(loop);
    if (controls) controls.update();
    renderCallback();
  }
  loop();
}
