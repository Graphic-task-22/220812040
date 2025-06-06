// // main.js
// import { initScene } from './sceneSetup.js';
// import mountain, { updatePosition } from './mountain.js';

// const { scene, camera, renderer, controls } = initScene();
// scene.add(mountain);

// function animate() {
//     requestAnimationFrame(animate);
//     updatePosition(); // 动态更新山脉顶点
//     renderer.render(scene, camera);
//     controls.update();
// }

// animate();



// src/main.js
import { initScene } from './sceneSetup.js';
import mountainMesh, { updatePosition, setConfig } from './mountain.js';
import { createControls } from './controls.js';

const { scene, camera, renderer, controls } = initScene();
scene.add(mountainMesh);

// 控制参数
const config = {
    speed: 1.0,
    ambientLight: 0.6,
    pointLight: 0.9,
    bottomColor: '#ff4e50',
    topColor: '#32ff6a',
};

let ambientLight = scene.getObjectByName('ambientLight');
let pointLight = scene.getObjectByName('pointLight');

// 创建控制面板
createControls(config, () => {
    setConfig(config);
    ambientLight.intensity = config.ambientLight;
    pointLight.intensity = config.pointLight;
});

function animate() {
    requestAnimationFrame(animate);
    updatePosition(Date.now());
    controls.update();
    renderer.render(scene, camera);
}
animate();
