import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('../public/image.png');

const geometry = new THREE.SphereGeometry(30, 64, 64);

const material = new THREE.MeshPhongMaterial({
  map: earthTexture,
  shininess: 20 // 从 5 提高到 20，增加高光效果
});


const earth = new THREE.Mesh(geometry, material);

export { earth, material as earthMaterial, geometry as earthGeometry, createEarth };

function createEarth() {
  return earth;
}
