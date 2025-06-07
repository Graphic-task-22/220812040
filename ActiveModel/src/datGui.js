import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// 初始化场景、相机、渲染器等
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 添加灯光
const light = new THREE.HemisphereLight(0xffffff, 0x444444);
light.position.set(0, 20, 0);
scene.add(light);

// 加载模型与动画
const loader = new GLTFLoader();
let mixer;
let actions = {};
let activeAction;
let previousAction;

const clock = new THREE.Clock();

loader.load('./public /models/Soldier.glb', function (gltf) {
  const model = gltf.scene;
  scene.add(model);

  mixer = new THREE.AnimationMixer(model);

  // 遍历所有动画剪辑，创建动作
  gltf.animations.forEach((clip) => {
    const action = mixer.clipAction(clip);
    actions[clip.name] = action;
  });

  // 默认播放 walk 动作
  if (actions['Walk']) {
    activeAction = actions['Walk'];
    activeAction.play();
  }

  // 初始化 dat.GUI
  initGUI();
}, undefined, function (error) {
  console.error(error);
});

function initGUI() {
  const gui = new GUI();
  const params = {
    currentAction: 'Walk',
    play: () => {
      if (activeAction) activeAction.paused = false;
    },
    pause: () => {
      if (activeAction) activeAction.paused = true;
    },
    switchTo: 'Run',
  };

  // 动作切换控制器
  gui.add(params, 'currentAction', Object.keys(actions)).name('当前动作').onChange((name) => {
    switchAction(name);
  });

  gui.add(params, 'switchTo', Object.keys(actions)).name('切换至');
  gui.add(params, 'play').name('播放');
  gui.add(params, 'pause').name('暂停');
  gui.add({ 切换: () => switchAction(params.switchTo) }, '切换').name('执行切换');
}

function switchAction(name) {
  if (name === activeAction?._clip?.name) return;

  previousAction = activeAction;
  activeAction = actions[name];

  if (previousAction) {
    previousAction.fadeOut(0.5);
  }
  activeAction.reset().fadeIn(0.5).play();
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  renderer.render(scene, camera);
}
animate();
