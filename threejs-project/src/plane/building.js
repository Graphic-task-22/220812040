import * as THREE from 'three';

function createBuilding(tileIndex, height) {
  const building = new THREE.Group();
  const x = tileIndex * 42; // 基于 tileSize 对齐

  // 立方体建筑主体
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(30, height, 30),
    new THREE.MeshLambertMaterial({ color: 0xff6347, flatShading: true }) // 红色建筑
  );
  cube.position.set(x, height / 2, 15); // 居中放置，z 略抬高
  cube.castShadow = true;
  cube.receiveShadow = true;
  building.add(cube);

  // 添加屋顶（简单圆锥）
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(15, 20, 4),
    new THREE.MeshLambertMaterial({ color: 0x4682b4, flatShading: true }) // 蓝色屋顶
  );
  roof.position.set(x, height + 10, 15);
  roof.castShadow = true;
  roof.receiveShadow = true;
  building.add(roof);

  return building;
}

export default createBuilding;