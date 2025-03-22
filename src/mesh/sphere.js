import * as THREE from 'three';
// 球体
// var sphereGeometry = new THREE.SphereGeometry(
//     // radius,          // 半径
//     // widthSegments,   // 水平分段数
//     // heightSegments,  // 垂直分段数
//     // phiStart,        // 起始纬度
//     // phiLength,       // 纬度角度长度
//     // thetaStart,      // 起始经度
//     // thetaLength      // 经度角度长度
// );
var sphereGeometry=new THREE.SphereGeometry(30,30,30);

//纹理贴图加载器TextureLoader
const texLoader = new THREE.TextureLoader();
const texture = texLoader.load('./src/assets/earth_day_4096.png');
var sphereMaterial=new THREE.MeshPhongMaterial({
    // color: 0xff0f00,
    // opacity: 0.8,
    // transparent: true,
    map: texture,});

// 网格包含一个几何体以及作用在此几何体上的材质，我们可以直接将网格对象放入到我们的场景中，并让它在场景中自由移动。
var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
export default sphere;
