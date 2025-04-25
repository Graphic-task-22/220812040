import * as THREE from 'three';

const x = 0, y = 0;

// 创建爱心形状
const heartShape = new THREE.Shape();
heartShape.moveTo(x + 5, y + 5);
heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

// 添加圆形镂空
const path = new THREE.Path();
path.arc(5.5, 8, 3); // 调整圆心位置适配翻转后坐标
heartShape.holes.push(path);

// 创建挤出几何体
const geometry = new THREE.ExtrudeGeometry(heartShape, {
    depth: 5,
    bevelEnabled: false
});

// 绕X轴旋转180度解决翻转问题
geometry.rotateX(Math.PI); 

// 调整材质参数
const material = new THREE.MeshLambertMaterial({
    color: new THREE.Color('rgba(0,255,0,0.4)'), // 使用rgba格式透明度
    transparent: true,    // 启用透明
    opacity: 0.5,        // 额外透明度控制
    side: THREE.DoubleSide
});

const shapeMesh = new THREE.Mesh(geometry, material);

export default shapeMesh;