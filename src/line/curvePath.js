import * as THREE from 'three';
//线1
const p1 = new THREE.Vector2(0, 200);
const p2 = new THREE.Vector2(100, 100);
const line1 = new THREE.LineCurve(p1, p2);

//线2
const p3 = new THREE.Vector2(0, 200);
const p4 = new THREE.Vector2(-100, 100);
const line2 = new THREE.LineCurve(p3, p4);
//椭圆半圆弧
const arc = new THREE.EllipseCurve(0, 100, 100 , 100, 0, Math.PI,false, Math.PI);

const curvePath = new THREE.CurvePath();
curvePath.add(line1);
curvePath.add(arc);
curvePath.add(line2);


const pointsArr = curvePath.getPoints(20);
const geometry = new THREE.BufferGeometry();
geometry.setFromPoints(pointsArr);

const material = new THREE.LineBasicMaterial({
    color: new THREE.Color('pink')
});

const curvePathObject = new THREE.Line(geometry, material);

export default curvePathObject;
