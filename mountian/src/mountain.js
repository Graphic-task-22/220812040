// import * as THREE from 'three';
// import { createNoise2D } from 'simplex-noise';
// const noise2D = createNoise2D();
// // const plane = new THREE.PlaneGeometry(100, 100);

// const geometry = new THREE.PlaneGeometry(300, 300, 50, 60); // 设置分段

// // 创建颜色属性
// const colors = [];
// const positionAttr = geometry.attributes.position;

// for (let i = 0; i < positionAttr.count; i++) {
//     const y = positionAttr.getY(i);
    
//     // 渐变色逻辑：你可以根据 y 值或位置计算
//     const t = (y + 250) / 500; // 将 y 映射到 0~1 范围
//     const r = 0.2 + 0.8 * t;   // 红色分量渐变
//     const g = 0.5 + 0.5 * (1 - t); // 绿色分量渐变
//     const b = 1.0 - 0.5 * t;   // 蓝色分量渐变

//     colors.push(r, g, b);
// }

// geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

// const material = new THREE.MeshBasicMaterial({
//     // color: new THREE.Color('orange'),
//     vertexColors: true, // 启用顶点颜色
//     wireframe: true, // 显示网格线
// });
// const planeMesh = new THREE.Mesh(geometry, material);


// //动画
// export function updatePosition(){
//     const positions = geometry.attributes.position;
//     // console.log("positions", positions);
//     for (let i = 0; i < positions.count; i++) {
//         // positions.setZ(i, Math.random() * 100); // 高度
//         const x = positions.getX(i);
//         const y = positions.getY(i);
//         let z = noise2D(x/100 , y/100 )*50;
//         const sinNum = Math.sin(Date.now() * 0.002 + x * 0.05) * 10;
//         positions.setZ(i, z+sinNum); // 反转高度
//        // console.log(positions.getX(i), positions.getY(i), positions.getZ(i))

//     }
//     positions.needsUpdate = true; // 更新缓冲区
// }




// planeMesh.rotateX(Math.PI / 2); // 绕x轴旋转90度
// export default planeMesh;






// src/mountain.js
import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';
const noise2D = createNoise2D();

let config = {
    speed: 1,
    bottomColor: '#ff4e50',
    topColor: '#32ff6a',
};

const geometry = new THREE.PlaneGeometry(300, 300, 50, 60);
const colors = new Float32Array(geometry.attributes.position.count * 3);
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.MeshBasicMaterial({
    vertexColors: true,
    wireframe: true,
});
const planeMesh = new THREE.Mesh(geometry, material);
planeMesh.rotateX(Math.PI / 2);

function updateColor() {
    const pos = geometry.attributes.position;
    const colorAttr = geometry.attributes.color;

    const colorBottom = new THREE.Color(config.bottomColor);
    const colorTop = new THREE.Color(config.topColor);

    for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        const t = (y + 250) / 500;
        const color = colorBottom.clone().lerp(colorTop, t);
        colorAttr.setXYZ(i, color.r, color.g, color.b);
    }
    colorAttr.needsUpdate = true;
}

updateColor();

export function updatePosition(time) {
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = noise2D(x / 100, y / 100) * 50;
        const sinZ = Math.sin(time * 0.002 * config.speed + x * 0.05) * 10;
        pos.setZ(i, z + sinZ);
    }
    pos.needsUpdate = true;
}

export function setConfig(newConfig) {
    config = newConfig;
    updateColor();
}

export default planeMesh;
