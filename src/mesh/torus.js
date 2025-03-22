import * as THREE from 'three';
// 圆环
var torusGeometry = new THREE.TorusGeometry(
    20,       // 半径
    5,         // 管厚度
    // 30, // 径向分段数
    // 30 // 管圈分段数
);

// 给一个材质，让它有颜色
const torusMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00,transparent:true,opacity:0.8 });//设置透明度0.3

// Mesh（网格）
// 网格包含一个几何体以及作用在此几何体上的材质，我们可以直接将网格对象放入到我们的场景中，并让它在场景中自由移动。
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(50, 30,30);
export default torus;