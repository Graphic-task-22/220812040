import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


export const collisionBoxes = [];


export function loadCommunityModel(scene) {




    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        const allModels = [];
        loader.load(
            '../../public/models/fcdda23c281e4934826b8dfde3b0598e.glb',
            (gltf) => {
                const customModel = gltf.scene;

                // 打印所有节点名称以调试
                console.group('所有可用节点名称');
                customModel.traverse((child) => {
                    if (child.name) {
                        console.log(`节点名称: ${child.name}`);
                        // 新增：重置每个子节点的旋转和位置
                        // child.rotation.set(0, 0, 0);
                        child.position.set(0, 0, 0);
                    }
                });
                console.groupEnd();

                const componentsConfig = [
                    //竹子
                    ...[-17, -23, -25, -30, -37, -44, -51].map(z => [
                        {
                            name: 'Tree_Bamboo_001_01',
                            pos: [-45, -0.1, z],
                            scale: 0.05,
                            rotation: [Math.PI / 2, -Math.PI, Math.PI / 2]
                        }
                    ]).flat(),
                    ...[-5, -7, -25, -35, -37, -44, -51].map(z => [
                        {
                            name: 'Tree_Bamboo_001_01',
                            pos: [-50, -0.1, z],
                            scale: 0.05,
                            rotation: [Math.PI / 2, -Math.PI, Math.PI / 2]
                        }
                    ]).flat(),
                    {
                        name: 'Tree_Bamboo_001_02',
                        pos: [-43.5, -0.1, -6],
                        scale: 0.05,
                        rotation: [Math.PI / 2, Math.PI, Math.PI / -1]
                    },
                    {
                        name: 'Tree_Bamboo_001_01',
                        pos: [40.5, -0.1, -6],
                        scale: 0.05,
                        rotation: [Math.PI / 2, Math.PI, Math.PI / -1]
                    },
                    ...[-7, -25, -15, -31].map(z => [
                        {
                            name: 'Tree_Bamboo_001_02',
                            pos: [50, -0.1, z],
                            scale: 0.05,
                            rotation: [Math.PI / 2, -Math.PI, Math.PI / 2]
                        }
                    ]).flat(),

                    {
                        name: 'Tree_006_09',
                        pos: [55, -0.5, 33],
                        scale: 0.03,
                        rotation: [Math.PI / 2, -Math.PI, Math.PI / 2]
                    },
                    {
                        name: 'Tree_006_03',
                        pos: [-16, -0.5, 47],
                        scale: 0.04,
                        rotation: [Math.PI / 2, -Math.PI, Math.PI / 2]
                    },
                    {
                        name: 'Tree_006_06',
                        pos: [-58, 7.5, 59],
                        scale: 0.01,
                        rotation: [Math.PI / 2, -Math.PI, Math.PI / 2]
                    },
                ]

                componentsConfig.forEach(config => {
                    const originalPart = customModel.getObjectByName(config.name);
                    if (originalPart) {
                        const part = originalPart.clone();
                        part.position.set(...config.pos);
                        part.scale.setScalar(config.scale);
                        part.rotation.set(...config.rotation);
                        scene.add(part);

                        part.updateMatrixWorld(true);
const box = new THREE.Box3().setFromObject(part);
collisionBoxes.push(box); // ✅ 记录为碰撞物体

                        // 为树木添加碰撞盒
                        // const box = new THREE.Box3().setFromObject(part);
                        // collisionBoxes.push(box);

                        console.log(`✅ 成功加载部件: ${config.name}`);
                    } else {
                        console.warn(`⚠️ 未找到部件: ${config.name}`);
                    }
                });
                console.groupEnd();

                scene.add(customModel);
                console.log('✅ 自定义模型加载成功');
            }
        );


        loader.load(
            '../../public/models/community.glb',
            (gltf) => {
                const model = gltf.scene;

                // 打印所有节点名称以调试
                // console.group('所有可用节点名称');
                model.traverse((child) => {
                    if (child.name) {
                        // console.log(`节点名称: ${child.name}`);
                        // 新增：重置每个子节点的旋转和位置
                        child.rotation.set(0, 0, 0);
                        child.position.set(0, 0, 0);
                    }
                });
                console.groupEnd();

                // 更新配置以匹配 GLTF 中的节点名称
                const componentsConfig = [
                    //建筑群1
                    {
                        name: 'hepinggu_static25_1',
                        pos: [-40, -1.5, -50],
                        scale: 25,
                        rotation: [-Math.PI / 2, 0, 0]
                    },
                    {
                        name: 'hepinggu_static25_2',//墙2.2
                        pos: [-40, -1.5, -50],
                        scale: 25,
                        rotation: [-Math.PI / 2, 0, 0]
                    },
                    {
                        name: 'hepinggu_static23_1',//墙2.1
                        pos: [-25, -1.5, -50],
                        scale: 25,
                        rotation: [-Math.PI / 2, 0, 0]
                    },
                    {
                        name: 'hepinggu_static23_2',//墙2.2
                        pos: [-25, -1.5, -50],
                        scale: 25,
                        rotation: [-Math.PI / 2, 0, 0]
                    },
                    {
                        name: 'hepinggu_static23_3',//拱
                        pos: [-25, -1.5, -50],
                        scale: 25,
                        rotation: [-Math.PI / 2, 0, 0]
                    },

                    //建筑2
                    {
                        name: 'hepinggu_static30_1',//墙1.1
                        pos: [-53, -0.1, 59],
                        scale: 25,
                        rotation: [-Math.PI / 2, 0, 0]
                    },
                    {
                        name: 'hepinggu_static30_2',
                        pos: [-53, -0.1, 59],
                        scale: 25,
                        rotation: [-Math.PI / 2, 0, 0]
                    },

                    //建筑3
                    {
                        name: 'hepinggu_static29_1',
                        pos: [-48, -6.5, 5],
                        scale: 25,
                        rotation: [Math.PI / 2, -Math.PI, Math.PI / 2]
                    },
                    {
                        name: 'hepinggu_static29_2',
                        pos: [-48, -6.5, 5],
                        scale: 25,
                        rotation: [Math.PI / 2, -Math.PI, Math.PI / 2]
                    },
                    {
                        name: 'hepinggu_static29a',
                        pos: [-48, -6.5, 5],
                        scale: 25,
                        rotation: [Math.PI / 2, -Math.PI, Math.PI / 2]
                    },

                    //建筑4
                    {
                        name: 'hepinggu_static28',
                        pos: [47, -0.1, 5],
                        scale: 25,
                        rotation: [Math.PI / 2, -Math.PI, Math.PI / 2]
                    },

                    //建筑5
                    {
                        name: 'hepinggu_static24',
                        pos: [47, -0.1, 3],
                        scale: 25,
                        rotation: [Math.PI / 2, -Math.PI, Math.PI / 2]
                    },

                    //建筑6
                    {
                        name: 'hepinggu_static27',
                        pos: [-50, -0.1, 35],
                        scale: 25,
                        rotation: [Math.PI / 2, Math.PI / -1, Math.PI / -2]
                    },

                    // 右
                    ...[47, 40, 33, 26, 19, 12, 5, -2, -9, -16, -23, -30, -37, -44, -51, -58].map(z => [
                        {
                            name: 'hepinggu_static42_1',
                            pos: [-59.5, -0.1, z],
                            scale: 25,
                            rotation: [Math.PI / 2, -Math.PI, Math.PI / 2]
                        },
                        {
                            name: 'hepinggu_static42_2',
                            pos: [-59.5, -0.1, z],
                            scale: 25,
                            rotation: [Math.PI / 2, -Math.PI, Math.PI / 2]
                        }
                    ]).flat(),


                    //后
                    ...[54, 47, 40, 33, 26, 19, 12, 5, -2, -9, -16, -23, -30, -37, -44, -51, -58].map(x => [
                        {
                            name: 'hepinggu_static42_1',
                            pos: [x, -0.1, -59],
                            scale: 25,
                            rotation: [Math.PI / 2, -Math.PI, 0]
                        },
                        {
                            name: 'hepinggu_static42_2',
                            pos: [x, -0.1, -59],
                            scale: 25,
                            rotation: [Math.PI / 2, -Math.PI, 0]
                        }
                    ]).flat(),

                    //前
                    ...[54, 47, 40, 33, 26, 19, 12, 5, -2, -9, -16, -23, -30, -37, -44].map(x => [
                        {
                            name: 'hepinggu_static42_1',
                            pos: [x, -0.2, 59.5],
                            scale: 25,
                            rotation: [Math.PI / 2, -Math.PI, 0]
                        },
                        {
                            name: 'hepinggu_static42_2',
                            pos: [x, -0.2, 59.5],
                            scale: 25,
                            rotation: [Math.PI / 2, -Math.PI, 0]
                        }
                    ]).flat(),

                    // 左
                    ...[54, 47, 40, 33, 26, 19, 12, 5, -2, -9, -16, -23, -30, -37, -44, -51, -58].map(z => [
                        {
                            name: 'hepinggu_static42_1',
                            pos: [59.5, -0.1, z],
                            scale: 25,
                            rotation: [Math.PI / 2, -Math.PI, Math.PI / 2]
                        },
                        {
                            name: 'hepinggu_static42_2',
                            pos: [59.5, -0.1, z],
                            scale: 25,
                            rotation: [Math.PI / 2, -Math.PI, Math.PI / 2]
                        }
                    ]).flat(),


                    //石头
                    {
                        name: 'hepinggu_static14',
                        pos: [-45, -0.1, -13],
                        scale: 25,
                        rotation: [-Math.PI / 2, 0, Math.PI / 4]
                    },
                    {
                        name: 'hepinggu_static14',
                        pos: [-6, -1.5, -45],
                        scale: 20,
                        rotation: [-Math.PI / 2, 0, Math.PI]
                    },

                ];

                console.group('模型部件加载情况');
                componentsConfig.forEach(config => {
                    const originalPart = model.getObjectByName(config.name);
                    if (originalPart) {
                        const part = originalPart.clone();
                        part.position.set(...config.pos);
                        part.scale.setScalar(config.scale);
                        part.rotation.set(...config.rotation);
                        scene.add(part);

part.updateMatrixWorld(true);
const box = new THREE.Box3().setFromObject(part);
collisionBoxes.push(box); // ✅ 记录为碰撞物体

                        allModels.push(part);
                        // 为树木添加碰撞盒
                        // const box = new THREE.Box3().setFromObject(part);
                        // collisionBoxes.push(box);

                        console.log(`✅ 成功加载部件: ${config.name}`);
                    } else {
                        console.warn(`⚠️ 未找到部件: ${config.name}`);
                    }
                });
                console.groupEnd();

                // 可选：处理 Pivot 节点
                const pivot = model.getObjectByName('Pivot');
                if (pivot) {
                    pivot.position.set(0, 0, 0);
                    pivot.rotation.set(0, 0, 0);
                }

                // 新增：重置根节点的变换
                model.position.set(0, 0, 0);
                model.rotation.set(0, 0, 0);
                model.scale.set(1, 1, 1);

                // resolve(model,collisionBoxes);
                resolve(allModels);
            },
            undefined,
            (error) => {
                console.error('❌ 加载社区模型出错:', error);
                reject(error);
            }
        );
    });
}