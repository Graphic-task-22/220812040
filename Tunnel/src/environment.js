import * as THREE from 'three';

export let scene, camera, renderer, tubePoints;

export function initScene() {
    // 创建场景
    scene = new THREE.Scene();

    // 创建相机
    camera = new THREE.PerspectiveCamera(
        75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    camera.position.z = 200;

    // 渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 曲线用于生成路径点
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 100),
        new THREE.Vector3(100, 0, 0),
        new THREE.Vector3(100, 50, -50),
        new THREE.Vector3(0, 0, -100),
        new THREE.Vector3(-100, -50, -50),
        new THREE.Vector3(-100, 0, 0),
        new THREE.Vector3(-50, 100, 50),
        new THREE.Vector3(0, 100, 0),
        new THREE.Vector3(50, -100, 50),
        new THREE.Vector3(0, -100, 0),
        new THREE.Vector3(0, 0, 100)
    ]);
    tubePoints = curve.getPoints(100);

    // 光照
    const ambientLight = new THREE.AmbientLight(0x555555,3);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 1000);
    pointLight.position.set(0, 0, 100);
    scene.add(pointLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(1, 1, 1); // 光源方向
scene.add(directionalLight);


    // 响应窗口尺寸
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
