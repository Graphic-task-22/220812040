import * as THREE from 'three';

// /**纹理坐标0~1之间随意定义*/
// const uvs = new Float32Array([
//     0, 0, //图片左下角
//     1, 0, //图片右下角
//     1, 1, //图片右上角
//     0, 1, //图片左上角
// ]);
const geometry = new THREE.PlaneGeometry(300, 300,100,100);
// 设置几何体attributes属性的位置normal属性
// geometry.attributes.uv = new THREE.BufferAttribute(uvs, 2); //2个为一组,表示一个顶点的纹理坐标

//纹理贴图加载器TextureLoader
const texLoader = new THREE.TextureLoader();
// .load()方法加载图像，返回一个纹理对象Texture
const texture = texLoader.load('./src/assets/misc_controls_trackball.jpg');

// 设置阵列模式
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
// uv两个方向纹理重复数量
texture.repeat.set(12,12);//注意选择合适的阵列数量


const material = new THREE.MeshPhongMaterial({ 
    // color: 0xf0000ff, 
    // opacity:0.6,
    // transparent:true,
    // 设置纹理贴图：Texture对象作为材质map属性的属性值
    map: texture,//map表示材质的颜色贴图属性
});

const plane = new THREE.Mesh(geometry, material);
plane.position.set(0, 0, -5);
plane.rotation.x = -Math.PI / 2;
export default plane;