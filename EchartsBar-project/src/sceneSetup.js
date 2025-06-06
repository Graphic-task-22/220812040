// sceneSetup.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function initScene() {
    const container = document.body; // 用 body 作为容器

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("black");

    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    // 更正摄像机位置（让视角正面看 X-Y 方向）
    camera.position.set(100, 0, 300); // Z值更大，垂直于XY平面
    camera.lookAt(50, 50, 0);         // 看向图中央


    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // 从 1.0 提升到 1.5
    scene.add(ambientLight);



    const pointLight = new THREE.PointLight(0xffffff, 2.5); // 增加亮度
    pointLight.position.set(150, 120, 100); // 更靠近图表
    scene.add(pointLight);
    const pointLight2 = new THREE.PointLight(0xffffff, 1.8);
    pointLight2.position.set(-100, 80, 80); // 从左后打光
    scene.add(pointLight2);


    const controls = new OrbitControls(camera, renderer.domElement);

    return { scene, camera, renderer, controls };
}
