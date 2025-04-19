import * as THREE from "three";

const vector2 = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-100, 100, 0),
    new THREE.Vector3(100, 0, 0),
];

// 使用 CatmullRomCurve3 创建曲线对象
const curve = new THREE.CatmullRomCurve3(vector2);

const points = curve.getPoints(10);
const geometry = new THREE.BufferGeometry().setFromPoints(points);

const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
const splineCurve = new THREE.Line(geometry, material);

const points2 = new THREE.Points(
  geometry,
  new THREE.PointsMaterial({ color: 0x00ff00, size: 2 })
);

const geometry2 = new THREE.BufferGeometry().setFromPoints(vector2);
const material2 = new THREE.PointsMaterial({ color: 0xffffff, size: 5 });
const points3 = new THREE.Points(geometry2, material2);

splineCurve.add(points2);
splineCurve.add(points3);

export default splineCurve;
