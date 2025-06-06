import { scene, camera, renderer } from './environment.js';
import pig from './models/pig.js';
import zebra from './models/zebra.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 添加模型
scene.add(pig);
scene.add(zebra);
// 控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

// 自适应窗口大小
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
