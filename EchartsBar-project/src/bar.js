import * as THREE from 'three';

const groups = new THREE.Group();

function createdLine(type) {
    // 创建坐标轴
    const points = [
        new THREE.Vector3(0, 0, 0),
        type === 'y' ? new THREE.Vector3(0, 100, 0) : new THREE.Vector3(120, 0, 0)
    ];

    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        linewidth: 2
    });
    return new THREE.Line(geometry, material);
}

function createScaleLine(type) {
    // 创建刻度线
    const points = [];
    for (let i = 0; i <= 100; i += 10) {
        if (type === 'y') {
            points.push(new THREE.Vector3(0, i, 0));
            points.push(new THREE.Vector3(-3, i, 0));
        } else {
            points.push(new THREE.Vector3(i, 0, 0));
            points.push(new THREE.Vector3(i, -3, 0));
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
        color: 0xcccccc,
        linewidth: 1
    });
    return new THREE.LineSegments(geometry, material);
}

function createBar(dataArr) {
    // 创建渐变柱状图
    const bars = new THREE.Group();
    dataArr.forEach((data, index) => {
        // 根据数据值计算颜色（从蓝色到绿色渐变）
        const colorValue = data / 100;
        const color = new THREE.Color(
            0.2 + 0.5 * (1 - colorValue), // R: 蓝色分量
            0.3 + 0.7 * colorValue,       // G: 绿色分量
            0.8                            // B: 固定蓝色分量
        );

        // 创建柱体
        // 创建柱体（使用顶点颜色实现内部渐变）
        const geometry = new THREE.BoxGeometry(8, data, 8);
        const colors = [];
        const colorBottom = new THREE.Color("green"); // 底部颜色：鲜艳红
        const colorTop = new THREE.Color("red");    // 顶部颜色：鲜艳绿

        // 为每个顶点设置颜色（BoxGeometry 有 8 个顶点 × 每个面 2 三角形 × 每个三角形 3 顶点）
        for (let i = 0; i < geometry.attributes.position.count; i++) {
            const y = geometry.attributes.position.getY(i);
            const t = (y + data / 2) / data; // 归一化高度（0 底部，1 顶部）
            const color = colorBottom.clone().lerp(colorTop, t); // 插值渐变
            colors.push(color.r, color.g, color.b);
        }

        // 添加颜色属性
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.MeshPhongMaterial({
            vertexColors: true, // 允许顶点颜色控制渲染
            shininess: 500,
            specular: 0xffffff
        });


        const bar = new THREE.Mesh(geometry, material);
        bar.position.set(index * 20 + 10 + 5, data / 2, 0);
        bars.add(bar);
        const barX = index * 20 + 15; // 柱子和文字统一 X 坐标
        bar.position.set(barX, data / 2, 0);

        // 创建数据标签
        const label = createTextLabel(data, barX, data + 6);
        bars.add(label);

    });
    return bars;
}

function createTextLabel(value, x, y) {
    // 创建文本标签
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 128;
    canvas.height = 64;

    // context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = 'bold 28px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#ffffff';
    context.fillText(`${value}`, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
    });

    const geometry = new THREE.PlaneGeometry(15, 7);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, 0);

    return mesh;
}

// 创建坐标轴
const xLine = createdLine('x');
const yLine = createdLine('y');

// 创建刻度线
const yScaleLine = createScaleLine('y');
const xScaleLine = createScaleLine('x');

// 添加坐标轴到组
groups.add(xLine, yLine, yScaleLine, xScaleLine);

// 创建柱状图并添加到组
const dataArr = [20, 45, 70, 90, 60, 35];
const barsGroup = createBar(dataArr);
groups.add(barsGroup);

// 添加标题
const title = createTitle("可视化柱状图");
title.position.set(50, 110, 0);
groups.add(title);

function createTitle(text) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;

    // context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = 'bold 48px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // 渐变标题
    const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#4facfe');
    gradient.addColorStop(1, '#00f2fe');
    context.fillStyle = gradient;

    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
    });

    const geometry = new THREE.PlaneGeometry(60, 15);
    return new THREE.Mesh(geometry, material);
}

export default groups;