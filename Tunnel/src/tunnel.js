import * as THREE from 'three';

export function createTunnel() {
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

    const geometry = new THREE.TubeGeometry(curve, 1000, 20, 1000, true);

    const loader = new THREE.TextureLoader();
    const texture = loader.load('./public/header_small.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.repeat.x = 20;

    const material = new THREE.MeshLambertMaterial({
        map: texture,
        side: THREE.DoubleSide
    });

    return new THREE.Mesh(geometry, material);
}
