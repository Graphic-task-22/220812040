import * as THREE from 'three';

// 载入雪花纹理
const textureLoader = new THREE.TextureLoader();
const snowflakeTextures = [
    textureLoader.load('./src/assets/sprites/snowflake1.png'),
    textureLoader.load('./src/assets/sprites/snowflake2.png'),
    textureLoader.load('./src/assets/sprites/snowflake3.png'),
    textureLoader.load('./src/assets/sprites/snowflake4.png'),
    textureLoader.load('./src/assets/sprites/snowflake5.png'),
    textureLoader.load('./src/assets/sprites/snowflake6.png')
];

// 生成雪花精灵
export function createSnowflakes(num = 100000) {
    const snowflakes = [];

    for (let i = 0; i < num; i++) {
        // 随机选择雪花纹理
        const texture = snowflakeTextures[Math.floor(Math.random() * snowflakeTextures.length)];

        // 创建材质
        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            rotation: Math.random() * Math.PI * 2
        });

        // 创建雪花精灵
        const sprite = new THREE.Sprite(spriteMaterial);
        
        // 随机大小
        const size = Math.random() * 5 + 5; // 5~10
        sprite.scale.set(size, size, 1);

        // 随机位置
        sprite.position.set(
            (Math.random() - 0.5) * window.innerWidth, // X
            Math.random() * window.innerHeight, // Y
            Math.random() * 50 - 25 // Z
        );

        snowflakes.push(sprite);
    }

    return snowflakes;
}
export default createSnowflakes;