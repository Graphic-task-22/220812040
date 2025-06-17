import * as THREE from 'three';

const minTileIndex = -8;
const maxTileIndex = 8;
const tilesPerRow = maxTileIndex - minTileIndex + 1;
const tileSize = 42;

function Road(rowIndex) {
  const road = new THREE.Group();
  road.position.y = rowIndex * tileSize;

  const createSection = (color) =>
    new THREE.Mesh(
      new THREE.PlaneGeometry(tilesPerRow * tileSize, tileSize),
      new THREE.MeshLambertMaterial({ color, side: THREE.DoubleSide })
    );

  // 中间灰色道路
  const middle = createSection(0x333333); // 灰色道路
  middle.receiveShadow = true;
  road.add(middle);

  // 左侧绿色草地
  const left = createSection(0x7cfc00); // 绿色地面
  left.position.x = -tilesPerRow * tileSize;
  left.receiveShadow = true;
  road.add(left);

  // 右侧绿色草地
  const right = createSection(0x7cfc00); // 绿色地面
  right.position.x = tilesPerRow * tileSize;
  right.receiveShadow = true;
  road.add(right);

  return road;
}

export default Road;