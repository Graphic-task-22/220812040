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
    const bars = new THREE.Group();
    const height = 100;

    dataArr.forEach((data, index) => {
        const geometry = new THREE.PlaneGeometry(10, data, 1, 10);

        const material = new THREE.MeshBasicMaterial({ vertexColors: true });
        const positions = geometry.getAttribute('position');
        const colorArr = [];

        // 三段颜色：绿色 → 白色 → 红色
        const color1 = new THREE.Color(0x00ff00); // green
        const color2 = new THREE.Color(0x0f00ff); // white
        const color3 = new THREE.Color(0xff0000); // red

        for (let i = 0; i < positions.count; i++) {
            const y = positions.getY(i);
            const t = (y + data / 2) / data; // 映射到 [0, 1]

            let color;
            if (t < 0.5) {
                const subT = t / 0.5; // [0, 0.5] → [0, 1]
                color = color1.clone().lerp(color2, subT); // green → white
            } else {
                const subT = (t - 0.5) / 0.5; // [0.5, 1] → [0, 1]
                color = color2.clone().lerp(color3, subT); // white → red
            }

            colorArr.push(color.r, color.g, color.b);
        }

        const colors = new Float32Array(colorArr);
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const bar = new THREE.Mesh(geometry, material);
        bar.position.x = index * 20 + 10 + 5;
        bar.position.y = data / 2;
        bars.add(bar);
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