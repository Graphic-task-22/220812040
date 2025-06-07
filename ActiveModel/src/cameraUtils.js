import * as THREE from 'three';

export function adjustCameraToObject(camera, object, distanceFactor = 1.5) {
  const boundingBox = new THREE.Box3().setFromObject(object);
  const center = boundingBox.getCenter(new THREE.Vector3());
  const size = boundingBox.getSize(new THREE.Vector3());
  
  // 计算包围球半径（对角线长度的一半）
  const radius = Math.sqrt(
    size.x * size.x + 
    size.y * size.y + 
    size.z * size.z
  ) / 2;
  
  // 根据视野计算理想距离
  const fov = camera.fov * (Math.PI / 180);
  const idealDistance = radius / Math.tan(fov / 2);
  
  // 应用距离系数
  const finalDistance = idealDistance * distanceFactor;
  
  // 设置相机位置
  camera.position.set(
    center.x,
    center.y + size.y * 0.3, // 稍微高于模型中心
    center.z + finalDistance
  );
  
  // 确保最小距离
  const minDistance = radius * 2.5;
  if (camera.position.distanceTo(center) < minDistance) {
    const direction = new THREE.Vector3()
      .subVectors(camera.position, center)
      .normalize()
      .multiplyScalar(minDistance);
    
    camera.position.copy(center).add(direction);
  }
  
  // 调整远裁剪面
  camera.far = finalDistance * 1000;
  camera.updateProjectionMatrix();
  
  camera.lookAt(center);
  
  // 调试信息
  console.log(`相机调整:
  模型半径: ${radius.toFixed(2)}
  理想距离: ${idealDistance.toFixed(2)}
  最终距离: ${finalDistance.toFixed(2)}
  实际距离: ${camera.position.distanceTo(center).toFixed(2)}`);
}