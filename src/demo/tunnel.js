import * as THREE from 'three';

//创建一个样条曲线
// 创建优化的闭合样条曲线
const curve = new THREE.CatmullRomCurve3([
    // 起始点 (需重复首尾点)
    new THREE.Vector3(0, 0, 100),
    
    // 主控制点群（对称布局）
    new THREE.Vector3(100, 0, 0),
    new THREE.Vector3(100, 50, -50),   // 新增中间点1
    new THREE.Vector3(0, 0, -100),
    new THREE.Vector3(-100, -50, -50), // 新增中间点2
    new THREE.Vector3(-100, 0, 0),
    new THREE.Vector3(-50, 100, 50),  // 新增中间点3
    new THREE.Vector3(0, 100, 0),
    new THREE.Vector3(50, -100, 50),  // 新增中间点4
    new THREE.Vector3(0, -100, 0),
    
    // 闭合衔接点（与起点相同）
    new THREE.Vector3(0, 0, 100)
]
);


//管道
const geometry = new THREE.TubeGeometry(curve, 1000, 20,1000, true);

const loader = new THREE.TextureLoader();
const texture=loader.load('./src/assets/suidao.jpg');
texture.wrapS = THREE.RepeatWrapping;
texture.colorSpace=THREE.SRGBColorSpace;

texture.repeat.x=20;
const material = new THREE.MeshLambertMaterial({
    // color: 0xffffff,
    // wireframe: true,
    map: texture,
    side: THREE.DoubleSide
});
const tube = new THREE.Mesh(geometry, material);


export const tubePoints = curve.getPoints(50);

export default tube;

//添加到场景中