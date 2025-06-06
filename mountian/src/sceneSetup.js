// sceneSetup.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function initScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    camera.position.set(0, 150, 300);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 环境光更亮
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // 点光源打在图表侧面
    const pointLight = new THREE.PointLight(0xffffff, 1.2);
    pointLight.position.set(200, 150, 100);
    scene.add(pointLight);

    const controls = new OrbitControls(camera, renderer.domElement);

    return { scene, camera, renderer, controls };
}
