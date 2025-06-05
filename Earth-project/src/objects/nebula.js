// objects/nebula.js
import * as THREE from 'three';

function createNebulaCloud(baseRadius = 35, count = 2000) {
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];

  for (let i = 0; i < count; i++) {
    // 全球范围分布：theta [0, 2π], phi [0, π]
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.random() * Math.PI;

    // 粒子围绕球体外壳分布，略有扰动
    const radius = baseRadius + (Math.random() - 0.5) * 3;

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    positions.push(x, y, z);

    // 星云颜色（白、灰、蓝偏冷调）
    const color = new THREE.Color();
    color.setHSL(0.6 + Math.random() * 0.1, 0.4, 0.5 + Math.random() * 0.4);
    colors.push(color.r, color.g, color.b);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.3,
    vertexColors: true,
    transparent: true,
    opacity: 0.4,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  points.name = 'NebulaCloud';
  return points;
}

export { createNebulaCloud };
