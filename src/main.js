import * as THREE from 'three';
// 引入gui.js
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';//引入额外的工具
import Stats from 'three/addons/libs/stats.module.js';
import cube, { applyEnvironmentMap } from './mesh/cube';//导入cube
import plane from './mesh/plane';
import sphere from './mesh/sphere';
import pointLight from './lights/pointlight';//导入点光源
import splineCurve from './line/splineCurve.js';
import bezierCurve from './line/quadraticBezierCurve.js';
import torus from './mesh/torus';
import sprite from './sprites/sprite';
import bezierCurve3 from './line/cubicBezierCurve3.js';
import curvePathObject from './line/curvePath.js';
import line from './line/line.js'; // 导入你写好的线条对象
import ellipseCurve from './line/ellipseCurve.js'; // 导入你写好的线条对象
import planeMesh, { updatePosition } from './demo/mountain.js';

// console.log('THREE',THREE);


//-------------------------------------------------------地球仪效果-------------------------------------------------------------

//创建场景，相机，渲染器
let renderer, camera, scene, ambientLight;



// ==============================================================================================
function init() {
    scene = new THREE.Scene();  //Object constructor 
    // 将cube导入到场景
    // scene.add(cube);
    // applyEnvironmentMap(scene);
    
    // 将sphere导入场景中
    scene.add(sphere);

    // scene.add(torus);
    //导入一个平面

    // 添加线条到场景中
    // scene.add(line);
    // scene.add(ellipseCurve);
    // scene.add(splineCurve);
    // scene.add(bezierCurve);
    // scene.add(bezierCurve3)
    // scene.add(curvePathObject)
    // scene.add(planeMesh)



    // 将点光导入场景（高开销）
    scene.add(pointLight);
    // 点光源辅助观察
    const pointLightHelpler = new THREE.PointLightHelper(pointLight);
    scene.add(pointLightHelpler);
    // 环境光（低开销）
    ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // 创建一个相机
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);  //PerspectiveCamera constructor
    //设置相机位置
    camera.position.set(100, 100, 100);
    camera.lookAt(0, 0, 0);
    console.log(scene.children);

    //创建一个渲染器
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,  // 允许透明背景
        powerPreference: "high-performance" // 提高渲染性能
    });
    renderer.setPixelRatio(window.devicePixelRatio);

    // 抗锯齿{antialias:true,}
    //// 获取你屏幕对应的设备像素比.devicePixelRatio告诉threejs,以免渲染模糊问题
    // // renderer.setPixelRatio(window.devicePixelRatio);

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1); //设置背景颜色
    renderer.render(scene, camera);    //导入
    document.body.appendChild(renderer.domElement);//把渲染器上的dom放进去
}

//监听窗口变化
window.onresize = function () {
    if (!renderer) return;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}


//辅助器函数（所有辅助器）
function initHelper() {
    // 辅助坐标轴
    const axesHelper = new THREE.AxesHelper(50);
    scene.add(axesHelper);

    // 设置相机控件轨道控制器OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
    controls.addEventListener('change', function () {
        renderer.render(scene, camera); //执行渲染操作
    }); //监听鼠标、键盘事件

    // // 添加一个辅助网格地面 网格地面辅助观察GridHelper
    // const gridHelper = new THREE.GridHelper(300, 25, 0x004444, 0x004444);
    // scene.add(gridHelper);//网格地面辅助器加入到场景中
}

function stopAnimate() {

    // 立方体旋转
    cube.rotation.x = 0;
    cube.rotation.y = 0;
    renderer.render(scene, camera);

}
// 渲染循环
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    updatePosition();
    // console.log(Date.now());
    // 立方体旋转
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;
    // 或 cube.rotateY(0.01)
}

function initState() {
    //创建stats对象
    const stats = new Stats();
    //stats.domElement:web页面上输出计算结果,一个div元素，
    document.body.appendChild(stats.domElement);
    // 渲染函数
    function render() {
        //requestAnimationFrame循环调用的函数中调用方法update(),来刷新时间
        stats.update();
        renderer.render(scene, camera);//执行渲染操作
        requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
    }
    render();
}

init();
initHelper();
initState();
animate();

const gui = new GUI();

// 创建控制项对象
const settings = {
    reset() {
        // 复位立方体的属性
        sphere.position.set(0, 0, 0);
        sphere.rotation.set(0, 0, 0);
        sphere.scale.set(1, 1, 1);
        sphere.material.color.set(0xfff000); // 颜色重置为白色
        sphere.material.transparent = false;
        ambientLight.intensity = 0.5; // 复位光照强度
        // 重置点光源状态
        settings.pointLightOn = true;
        pointLight.visible = true;
        pointLight.intensity = 1;
    },
    pointLightOn: true, // 控制点光源的开关
    // 预设的 X、Y、Z 轴位置值
    presetX: 0,
    presetY: 0,
    presetZ: 0
};

// 创建 Position 分组
const positionFolder = gui.addFolder('Position');
// X 轴控制
positionFolder.add(settings, 'presetX', [-50, -25, 0, 25, 50])
    .name('X 移动')
    .onChange(value => {
        sphere.position.x = value; // 选择值时更新 sphere 位置
    });
positionFolder.add(sphere.position, 'x', -100, 100).name('X 轴 (滑块)');

// Y 轴控制
positionFolder.add(settings, 'presetY', [-50, -25, 0, 25, 50])
    .name('Y 移动')
    .onChange(value => {
        sphere.position.y = value;
    });
positionFolder.add(sphere.position, 'y', -100, 100).name('Y 轴 (滑块)');

// Z 轴控制
positionFolder.add(settings, 'presetZ', [-50, -25, 0, 25, 50])
    .name('Z 移动')
    .onChange(value => {
        sphere.position.z = value;
    });
positionFolder.add(sphere.position, 'z', -100, 100).name('Z 轴 (滑块)');

// 创建 Rotation 分组
const rotationFolder = gui.addFolder('Rotation');
rotationFolder.add(sphere.rotation, 'x', 0, Math.PI * 2).name('X 旋转');
rotationFolder.add(sphere.rotation, 'y', 0, Math.PI * 2).name('Y 旋转');
rotationFolder.add(sphere.rotation, 'z', 0, Math.PI * 2).name('Z 旋转');

// 创建 Scale 分组
const scaleFolder = gui.addFolder('Scale');
scaleFolder.add(sphere.scale, 'x', 0.1, 3).name('X 缩放');
scaleFolder.add(sphere.scale, 'y', 0.1, 3).name('Y 缩放');
scaleFolder.add(sphere.scale, 'z', 0.1, 3).name('Z 缩放');

// 创建 Material 分组
const materialFolder = gui.addFolder('Material');
materialFolder.addColor({ color: sphere.material.color.getHex() }, 'color')
    .name('颜色')
    .onChange(value => sphere.material.color.set(value));
materialFolder.add(sphere.material, 'transparent').name('透明');
materialFolder.add(sphere.material, 'opacity', 0, 1).name('透明度');

// 创建 Light 控制
const lightFolder = gui.addFolder('Light');
lightFolder.add(ambientLight, 'intensity', 0, 2).name('环境光强度');
// **在 Light 分组中添加点光源的开关和强度**
lightFolder.add(settings, 'pointLightOn')
    .name('点光源开关')
    .onChange(value => {
        pointLight.visible = value; // 切换点光源开关
    });

lightFolder.add(pointLight, 'intensity', 0, 5).name('点光源强度');

// 添加重置按钮
gui.add(settings, 'reset').name('重置参数');

// 默认展开 GUI
gui.open();

//------------------------------------函数init()--------------------------------



//-------------------------------------------------地球仪效果--------------------------------------


//-------------------------精灵效果----------------------------------------------

// import { createSnowflakes } from './sprites/sprite.js';
// let renderer, camera, scene, ambientLight;
// let snowflakes = [];

// // 初始化场景
// function init() {
//     scene = new THREE.Scene();

//     // 添加光照
//     scene.add(initLight());

//     // 创建相机
//     camera = initCamera();
//     scene.add(camera);

//     // 创建渲染器
//     renderer = initRenderer();

//     // 生成雪花并添加到场景
//     snowflakes = createSnowflakes(10000);
//     snowflakes.forEach(sprite => scene.add(sprite));
// }

// // 初始化光照
// function initLight() {
//     const lightGroup = new THREE.Group();

//     // 环境光
//     ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//     lightGroup.add(ambientLight);

//     // // 点光源
//     // pointLight = new THREE.PointLight(0xffffff, 1, 500);
//     // pointLight.position.set(50, 50, 50);
//     // lightGroup.add(pointLight);

//     // // 点光源辅助观察
//     // const pointLightHelper = new THREE.PointLightHelper(pointLight);
//     // lightGroup.add(pointLightHelper);

//     return lightGroup;
// }

// // 初始化相机
// function initCamera() {
//     let cam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     cam.position.set(0, 50, 100);
//     cam.lookAt(0, 0, 0);
//     return cam;
// }

// // 初始化渲染器
// function initRenderer() {
//     let rend = new THREE.WebGLRenderer({
//         antialias: true,
//         alpha: true,
//         powerPreference: "high-performance"
//     });
//     rend.setPixelRatio(window.devicePixelRatio);
//     rend.setSize(window.innerWidth, window.innerHeight);
//     rend.setClearColor(0x000000, 1);
//     document.body.appendChild(rend.domElement);
//     return rend;
// }

// // 监听窗口变化
// window.onresize = function () {
//     if (!renderer) return;
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
// };

// // 初始化辅助工具
// function initHelper() {
//     // 坐标轴辅助
//     const axesHelper = new THREE.AxesHelper(50);
//     scene.add(axesHelper);

//     // 轨道控制器
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.addEventListener('change', () => renderer.render(scene, camera));

//     // 添加网格地面
//     const gridHelper = new THREE.GridHelper(300, 25, 0x444444, 0x444444);
//     scene.add(gridHelper);
// }

// // 运行雪花动画
// function animate() {
//     requestAnimationFrame(animate);

//     // 更新雪花位置
//     snowflakes.forEach(snowflake => {
//         snowflake.position.y -= Math.random() * 0.5 + 0.2;
//         snowflake.position.x += Math.sin(snowflake.position.y * 0.02) * 0.3;

//         if (snowflake.position.y < -window.innerHeight / 2) {
//             snowflake.position.y = window.innerHeight / 2;
//             snowflake.position.x = (Math.random() - 0.5) * window.innerWidth;
//         }
//     });


//     renderer.render(scene, camera);
// }

// // 启动
// init();
// initHelper();
// animate();

//-----------------------------------------精灵效果------------------------------------------------