import * as THREE from 'three';

export function createStreetGrid(scene, gridCount = 4) {
  const loader = new THREE.TextureLoader();
  const blockSize = 25;
  const groundSize = (gridCount * 2 + 1) * blockSize;

  // === 1. 草地地面 ===
  const grassTexture = loader.load('../public/textures/grass.jpg');
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(groundSize / 20, groundSize / 20);

  const grassMaterial = new THREE.MeshLambertMaterial({ map: grassTexture });
  const grassGeometry = new THREE.PlaneGeometry(groundSize, groundSize);
  const grass = new THREE.Mesh(grassGeometry, grassMaterial);
  grass.rotation.x = -Math.PI / 2;
  grass.receiveShadow = true;
  scene.add(grass);

  // === 2. 特定建筑：餐厅 ===
  const restaurant = new THREE.Mesh(
    new THREE.BoxGeometry(15, 25, 15),
    new THREE.MeshLambertMaterial({
      color: 0xff5555, // 或 map: loader.load('restaurant.jpg')
    })
  );
  restaurant.position.set(-groundSize / 2 + 20, 12.5, -groundSize / 2 + 20);
  restaurant.castShadow = true;
  restaurant.receiveShadow = true;
  restaurant.name = 'restaurant';
  scene.add(restaurant);

  // === 3. 特定建筑：配送点 ===
  const deliveryPoint = new THREE.Mesh(
    new THREE.BoxGeometry(15, 20, 15),
    new THREE.MeshLambertMaterial({
      color: 0x5555ff, // 或 map: loader.load('delivery.jpg')
    })
  );
  deliveryPoint.position.set(groundSize / 2 - 20, 10, groundSize / 2 - 20);
  deliveryPoint.castShadow = true;
  deliveryPoint.receiveShadow = true;
  deliveryPoint.name = 'delivery';
  scene.add(deliveryPoint);

  // === 4. 随机建筑 + 贴图 ===
  const buildingCount = 50;
  const minSize = 8;
  const maxSize = 15;


  // 预加载多个建筑贴图
  const buildingTextures = [
    loader.load('../public/textures/building1.jpg'),
    loader.load('../public/textures/building2.jpg'),
    loader.load('../public/textures/building3.jpg'),
  ];

  for (let i = 0; i < buildingCount; i++) {
    const x = (Math.random() - 0.5) * groundSize;
    const z = (Math.random() - 0.5) * groundSize;

    // 避开餐厅和配送点周围
    if (
      Math.abs(x - restaurant.position.x) < 20 &&
      Math.abs(z - restaurant.position.z) < 20
    ) continue;

    if (
      Math.abs(x - deliveryPoint.position.x) < 20 &&
      Math.abs(z - deliveryPoint.position.z) < 20
    ) continue;

    const width = THREE.MathUtils.lerp(minSize, maxSize, Math.random());
    const depth = THREE.MathUtils.lerp(minSize, maxSize, Math.random());
    const height = THREE.MathUtils.lerp(15, 60, Math.random());

    // 随机选择贴图
    const texture = buildingTextures[Math.floor(Math.random() * buildingTextures.length)];
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, height / 10);

    const material = new THREE.MeshLambertMaterial({ map: texture });

    const building = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      material
    );

    building.position.set(x, height / 2, z);
    building.castShadow = true;
    building.receiveShadow = true;
    scene.add(building);
  }
}
