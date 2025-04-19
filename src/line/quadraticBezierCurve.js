import * as THREE from 'three';

const curve = new THREE.QuadraticBezierCurve(
    new THREE.Vector2(0, 0),
    new THREE.Vector2(100, 100),
    new THREE.Vector2(200, 0),
);


const pointsArr = curve.getPoints(20);

const geometry = new THREE.BufferGeometry();
geometry.setFromPoints(pointsArr);

const material = new THREE.LineBasicMaterial({ 
    color: new THREE.Color('orange')
});

const bezierCurve = new THREE.Line( geometry, material );

const geometry2 = new THREE.BufferGeometry();
geometry2.setFromPoints([
    new THREE.Vector2(0, 0),
    new THREE.Vector2(100, 100),
    new THREE.Vector2(200, 0),
]);
const material2 = new THREE.PointsMaterial({
    color: new THREE.Color(0xfffff),
    size: 5
});
const points2 = new THREE.Points(geometry2, material2);
const line2 = new THREE.Line(geometry2, new THREE.LineBasicMaterial());
bezierCurve.add(points2,line2);

export default bezierCurve;
