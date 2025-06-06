// main.js
import { initScene } from './sceneSetup.js';
import groups from './bar.js';

const { scene, camera, renderer, controls } = initScene();
scene.add(groups);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
