import * as THREE from 'three';
//创建立方体
const geometry = new THREE.BoxGeometry(50, 50, 50);

// 加载环境贴图
// 加载周围环境6个方向贴图
// 上下左右前后6张贴图构成一个立方体空间
// 'px.jpg', 'nx.jpg'：x轴正方向、负方向贴图  p:正positive  n:负negative
// 'py.jpg', 'ny.jpg'：y轴贴图
// 'pz.jpg', 'nz.jpg'：z轴贴图
const textureCube = new THREE.CubeTextureLoader()
    .setPath('./环境贴图/环境贴图0/')
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
    // CubeTexture表示立方体纹理对象，父类是纹理对象Texture 
//纹理贴图加载器TextureLoader
// const texLoader = new THREE.TextureLoader();

// const texture = texLoader.load('./src/assets/earth_day_4096.png');
// // 给一个材质，让它有颜色


const material = new THREE.MeshPhongMaterial({ 
    // color: 0x00ff00,
    // transparent:true,
    // opacity:0.8 
    // map: texture,
    // metalness: 0.9,  // 适当降低金属度
    // roughness: 0.1,  // 使表面更加光滑
    envMap: textureCube,
});//设置透明度0.3

// Mesh（网格）
// 网格包含一个几何体以及作用在此几何体上的材质，我们可以直接将网格对象放入到我们的场景中，并让它在场景中自由移动。
const cube = new THREE.Mesh(geometry, material);
export function applyEnvironmentMap(Scene){
    Scene.background = textureCube; //设置背景环境贴图
    Scene.environment = textureCube; //设置环境贴图
}
export default cube; //导出立方体网格
