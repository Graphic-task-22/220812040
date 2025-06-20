// import * as THREE from 'three';

// export class WeatherSystem {
//   constructor(scene, camera) {
//     this.scene = scene;
//     this.camera = camera;

//     this.weatherGroup = new THREE.Group();
//     scene.add(this.weatherGroup);

//     this.particleCount = 1000;

//     this.params = {
//       weatherType: 'None', // 'None', 'Rain', 'Snow'
//       intensity: 1, // 0 ~ 1
//     };

//     this.clock = new THREE.Clock();

//     this.particles = null;
//     this.geometry = null;
//     this.material = null;

//     this.initParticles();
//   }

//   setWeatherType(type) {
//     this.params.weatherType = type;
//     this.clearParticles();
//     this.initParticles();
//   }

//   setIntensity(val) {
//     this.params.intensity = val;
//   }

//   initParticles() {
//     // 清除旧粒子系统
//     if (this.particles) {
//       this.clearParticles();
//     }

//     if (this.params.weatherType === 'None') {
//       // 不需要粒子
//       return;
//     }

//     this.geometry = new THREE.BufferGeometry();

//     const positions = [];
//     const velocities = [];

//     for (let i = 0; i < this.particleCount; i++) {
//       const x = (Math.random() - 0.5) * 200;
//       const y = Math.random() * 100 + 10;
//       const z = (Math.random() - 0.5) * 200;
//       positions.push(x, y, z);

//       if (this.params.weatherType === 'Rain') {
//         // 雨滴快速向下
//         velocities.push(0, - (Math.random() * 40 + 60), 0);
//       } else if (this.params.weatherType === 'Snow') {
//         // 雪花缓慢飘落并带横向微风
//         velocities.push(
//           (Math.random() - 0.5) * 1.5,
//           - (Math.random() * 10 + 10),
//           (Math.random() - 0.5) * 1.5
//         );
//       }
//     }

//     this.geometry.setAttribute(
//       'position',
//       new THREE.Float32BufferAttribute(positions, 3)
//     );
//     this.geometry.setAttribute(
//       'velocity',
//       new THREE.Float32BufferAttribute(velocities, 3)
//     );

//     let size = 0.1;
//     let color = 0xffffff;

//     if (this.params.weatherType === 'Rain') {
//       size = 0.1;
//       color = 0xaaaaee;
//     } else if (this.params.weatherType === 'Snow') {
//       size = 0.5;
//       color = 0xffffff;
//     }

//     this.material = new THREE.PointsMaterial({
//       size: size,
//       color: color,
//       transparent: true,
//       opacity: 0.7,
//       sizeAttenuation: true,
//       depthWrite: false,
//     });

//     this.particles = new THREE.Points(this.geometry, this.material);
//     this.weatherGroup.add(this.particles);
//   }

//   clearParticles() {
//     if (this.particles) {
//       this.weatherGroup.remove(this.particles);
//       this.geometry.dispose();
//       this.material.dispose();
//       this.particles = null;
//     }
//   }

//   update() {
//     if (!this.particles || this.params.weatherType === 'None') return;

//     const positions = this.geometry.attributes.position.array;
//     const velocities = this.geometry.attributes.velocity.array;
//     const delta = this.clock.getDelta();

//     for (let i = 0; i < this.particleCount; i++) {
//       positions[i * 3 + 0] += velocities[i * 3 + 0] * delta * this.params.intensity;
//       positions[i * 3 + 1] += velocities[i * 3 + 1] * delta * this.params.intensity;
//       positions[i * 3 + 2] += velocities[i * 3 + 2] * delta * this.params.intensity;

//       // 低于地面则重置到高处随机位置
//       if (positions[i * 3 + 1] < 0) {
//         positions[i * 3 + 0] = (Math.random() - 0.5) * 200;
//         positions[i * 3 + 1] = Math.random() * 100 + 50;
//         positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
//       }
//     }

//     this.geometry.attributes.position.needsUpdate = true;
//   }
// }
import * as THREE from 'three';

export class WeatherSystem {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;

    this.weatherGroup = new THREE.Group();
    scene.add(this.weatherGroup);

    this.particleCount = 1000;

    this.params = {
      weatherType: 'None', // 'None', 'Rain', 'Snow'
      intensity: 1,        // 0 ~ 1
    };

    this.clock = new THREE.Clock();

    this.particles = null;
    this.geometry = null;
    this.material = null;

    // 音效播放器初始化
    this.audioListener = new THREE.AudioListener();
    this.camera.add(this.audioListener);

    this.rainSound = new THREE.Audio(this.audioListener);
    this.rainSoundLoaded = false;

    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('../public/audio/rain.mp3', buffer => {
      this.rainSound.setBuffer(buffer);
      this.rainSound.setLoop(true);
      this.rainSound.setVolume(0);
      this.rainSoundLoaded = true;
      console.log('[WeatherSystem] 雨声音效加载完成');
    });

    // 用户交互事件绑定（只绑定一次）用于解锁音频播放
    this.userInteracted = false;
    const unlockAudio = () => {
      if (!this.userInteracted && this.rainSoundLoaded) {
        this.userInteracted = true;
        if (this.params.weatherType === 'Rain' && !this.rainSound.isPlaying) {
          this.rainSound.play().catch(e => {
            console.warn('雨声音效播放被阻止:', e);
          });
          console.log('[WeatherSystem] 雨声音效播放开始');
        }
      }
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('keydown', unlockAudio);

    this.initParticles();
  }

  setWeatherType(type) {
    this.params.weatherType = type;
    this.clearParticles();
    this.initParticles();

    // 控制音效播放与停止
    if (type === 'Rain' && this.rainSoundLoaded && this.userInteracted) {
      if (!this.rainSound.isPlaying) this.rainSound.play();
    } else {
      if (this.rainSound.isPlaying) this.rainSound.pause();
    }
  }

  setIntensity(val) {
    this.params.intensity = val;
    if (this.rainSoundLoaded && this.rainSound.isPlaying) {
      this.rainSound.setVolume(val);
    }
  }

  initParticles() {
    if (this.particles) {
      this.clearParticles();
    }

    if (this.params.weatherType === 'None') return;

    this.geometry = new THREE.BufferGeometry();

    const positions = [];
    const velocities = [];

    for (let i = 0; i < this.particleCount; i++) {
      const x = (Math.random() - 0.5) * 200;
      const y = Math.random() * 100 + 10;
      const z = (Math.random() - 0.5) * 200;
      positions.push(x, y, z);

      if (this.params.weatherType === 'Rain') {
        velocities.push(0, - (Math.random() * 40 + 60), 0);
      } else if (this.params.weatherType === 'Snow') {
        velocities.push(
          (Math.random() - 0.5) * 1.5,
          - (Math.random() * 10 + 10),
          (Math.random() - 0.5) * 1.5
        );
      }
    }

    this.geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );
    this.geometry.setAttribute(
      'velocity',
      new THREE.Float32BufferAttribute(velocities, 3)
    );

    let size = 0.1;
    let color = 0xffffff;

    if (this.params.weatherType === 'Rain') {
      size = 0.1;
      color = 0xaaaaee;
    } else if (this.params.weatherType === 'Snow') {
      size = 0.5;
      color = 0xffffff;
    }

    this.material = new THREE.PointsMaterial({
      size: size,
      color: color,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      depthWrite: false,
    });

    this.particles = new THREE.Points(this.geometry, this.material);
    this.weatherGroup.add(this.particles);
  }

  clearParticles() {
    if (this.particles) {
      this.weatherGroup.remove(this.particles);
      this.geometry.dispose();
      this.material.dispose();
      this.particles = null;
    }
  }

  update() {
    if (!this.particles || this.params.weatherType === 'None') return;

    const positions = this.geometry.attributes.position.array;
    const velocities = this.geometry.attributes.velocity.array;
    const delta = this.clock.getDelta();

    for (let i = 0; i < this.particleCount; i++) {
      positions[i * 3 + 0] += velocities[i * 3 + 0] * delta * this.params.intensity;
      positions[i * 3 + 1] += velocities[i * 3 + 1] * delta * this.params.intensity;
      positions[i * 3 + 2] += velocities[i * 3 + 2] * delta * this.params.intensity;

      if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 0] = (Math.random() - 0.5) * 200;
        positions[i * 3 + 1] = Math.random() * 100 + 50;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
      }
    }

    this.geometry.attributes.position.needsUpdate = true;
  }
}
