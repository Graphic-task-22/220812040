import * as THREE from 'three';
const geometry = new THREE.SphereGeometry(0.5, 32, 32);
const pointMaterial = new THREE.PointsMaterial({ color: 0xff0000 });
export default pointMaterial;