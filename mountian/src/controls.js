// src/controls.js
import * as dat from 'dat.gui';

export function createControls(config, onChangeCallback) {
    const gui = new dat.GUI();

    gui.add(config, 'speed', 0.1, 5.0, 0.1).name('山脉速度').onChange(onChangeCallback);
    gui.add(config, 'ambientLight', 0, 2, 0.1).name('环境光强').onChange(onChangeCallback);
    gui.add(config, 'pointLight', 0, 3, 0.1).name('点光源强').onChange(onChangeCallback);
    gui.addColor(config, 'bottomColor').name('底部颜色').onChange(onChangeCallback);
    gui.addColor(config, 'topColor').name('顶部颜色').onChange(onChangeCallback);

    return gui;
}
