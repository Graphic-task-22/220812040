// gui/guiControls.js
// 使用 dat.GUI 实现可视化控制地球与光源属性

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

/**
 * @param {THREE.Mesh} earth - 地球球体对象
 * @param {THREE.Light} ambientLight - 环境光
 * @param {THREE.Light} pointLight - 点光源
 * @param {Function} onRotateToggle - 控制旋转状态的回调函数
 */
function initGUI(earth, ambientLight, pointLight, onRotateToggle) {
  const gui = new GUI();

  const earthFolder = gui.addFolder('物体');

  // ✅ 添加旋转控制开关
  const control = { isRotating: true };
  earthFolder.add(control, 'isRotating')
    .name('自动旋转')
    .onChange(val => {
      if (typeof onRotateToggle === 'function') {
        onRotateToggle(val);
      }
    });

  const posFolder = earthFolder.addFolder('位置');
  posFolder.add(earth.position, 'x', -100, 100).name('x坐标');
  posFolder.add(earth.position, 'y', -100, 100).name('y坐标');
  posFolder.add(earth.position, 'z', -100, 100).name('z坐标');

  const matFolder = earthFolder.addFolder('材质');
  matFolder.addColor({ color: earth.material.color.getHex() }, 'color')
    .name('颜色')
    .onChange(val => earth.material.color.set(val));
  matFolder.add(earth.material, 'transparent').name('是否透明');
  matFolder.add(earth.material, 'opacity', 0, 1).name('透明度');

  const lightFolder = gui.addFolder('光源');

  const ambFolder = lightFolder.addFolder('环境光');
  ambFolder.addColor({ color: ambientLight.color.getHex() }, 'color')
    .name('颜色')
    .onChange(val => ambientLight.color.set(val));
  ambFolder.add(ambientLight, 'intensity', 0, 2).name('强度');

  const ptFolder = lightFolder.addFolder('点光源');
  ptFolder.addColor({ color: pointLight.color.getHex() }, 'color')
    .name('颜色')
    .onChange(val => pointLight.color.set(val));
  ptFolder.add(pointLight, 'intensity', 0, 5).name('强度');
  ptFolder.add(pointLight.position, 'x', -100, 100).name('x坐标');
  ptFolder.add(pointLight.position, 'y', -100, 100).name('y坐标');
  ptFolder.add(pointLight.position, 'z', -100, 100).name('z坐标');

  gui.open();
}

export { initGUI };
