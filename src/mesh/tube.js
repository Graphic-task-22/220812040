import * as THREE from 'three';

const p1 = new THREE.Vector3(-150, 0, 0);    // 起点左方
const p2 = new THREE.Vector3(-50, 120, 80);  // 向左上方倾斜
const p3 = new THREE.Vector3(50, 120, -80);  // 向右上方倾斜（镜像对称）
const p4 = new THREE.Vector3(150, 0, 0);     // 终点右方

const curve = new THREE.CubicBezierCurve3(p1, p2, p3, p4);

const geometry = new THREE.TubeGeometry(curve, 18, 20, 18, false);

const materail = new THREE.MeshLambertMaterial({
    color: new THREE.Color('white'),
    side: THREE.DoubleSide,
    wireframe: true
});

const tubeMesh = new THREE.Mesh(geometry, materail);

const geometry2 = new THREE.BufferGeometry();
geometry2.setFromPoints([p1,p2,p3,p4]);
const material2 = new THREE.PointsMaterial({
    color: new THREE.Color('blue'),
    size: 10
});
const points2 = new THREE.Points(geometry2, material2);
const line2 = new THREE.Line(geometry2, new THREE.LineBasicMaterial());
tubeMesh.add(points2, line2);

export default tubeMesh;
