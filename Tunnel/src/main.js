import { initScene, camera, renderer, scene, tubePoints } from './environment.js';
import { createTunnel } from './tunnel.js';
import { setupControls } from './controls.js';
import * as dat from 'dat.gui';
import * as THREE from 'three';
let i = 0;

// 控制参数（可由 GUI 控制）
const params = {
    speed: 1.0,       // 前进速度（小数也能流畅）
    autoMove: true    // 是否自动前进
};

// 初始化场景与物体
initScene();
const tunnel = createTunnel();
scene.add(tunnel);

// 添加光源跟随相机照亮前方（可选）
const headLight = new THREE.PointLight(0xffffff, 1.5, 500);
scene.add(headLight);

// GUI 控制器
const gui = new dat.GUI();
gui.add(params, 'speed', 0, 10, 0.1).name('前进速度');
gui.add(params, 'autoMove').name('自动前进');

// 动画循环 + 插值前进
function animate() {
    const index = Math.floor(i);
    const nextIndex = (index + 1) % tubePoints.length;
    const alpha = i - index;

    const currentPoint = tubePoints[index].clone();
    const nextPoint = tubePoints[nextIndex].clone();

    const interpolated = currentPoint.clone().lerp(nextPoint, alpha);

    camera.position.copy(interpolated);
    camera.lookAt(nextPoint);
    headLight.position.copy(camera.position);

    if (params.autoMove && params.speed > 0.01) {
        i = (i + params.speed) % tubePoints.length;
    }

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// 键盘 & 点击控制（仍然可操作）
setupControls(() => {
    i = (i + 8) % tubePoints.length;
}, () => {
    i = (i - 8 + tubePoints.length) % tubePoints.length;
}, () => {
    i = (i + 20) % tubePoints.length;
});

animate();
