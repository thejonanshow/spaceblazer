import { assetPath } from 'helpers/asset_path';
import config from 'game/config';
import Phaser from 'phaser';

class StarScene extends Phaser.Scene {
  constructor() {
    super({ key: 'stars', active: true });
    this.name = 'stars';
    this.starCount = 100;
    this.stars = [];
  }

  preload() {
    this.load.path = assetPath();
    this.load.multiatlas('stars', 'multipass.json');
  }

  create() {
    let speeds = [6, 8, 10, 12, 14];
    let layers = {};
    let starScene = this;

    speeds.forEach(function(speed) {
      layers[speed] = [];
    });

    for (var i = 0; i < this.starCount; i++) {
      let starSpeed = speeds.sample()

      layers[starSpeed].push({
        contrast: [20,30,40,60,70,80,90].sample(),
        color: ['blue', 'green', 'yellow', 'orange', 'red', 'purple'].sample(),
        scale: [0.3, 0.5, 0.8, 1].sample(),
        speed: starSpeed,
        rotation: ([0, 30, 45].sample() / 180) * Math.PI,
        scaleDirection: ['x', 'both', 'both'].sample(),
        x: Math.floor(Math.random() * screen.width),
        y: Math.floor(Math.random() * screen.height)
      });
    }

    Object.keys(layers).forEach(function(layerSpeed) {
      layers[layerSpeed].forEach(function(currentStar) {
        let texture = 'stars/' + currentStar.color + '/' + currentStar.contrast;
        let current = starScene.matter.add.sprite(currentStar.x, currentStar.y, 'stars', texture);

        current.body.plugin.wrap = {
          min: {
            x: 0,
            y: 0
          },
          max: {
            x: config.phaser.width,
            y: config.phaser.height
          }
        }

        current.setIgnoreGravity(true);
        current.setFriction(0, false, false);
        current.setCollidesWith(false);

        if (currentStar.scaleDirection == 'x' && currentStar.rotation == 0) {
          current.scaleX = currentStar.scale;
        }
        else if (currentStar.scaleDirection == 'y' && currentStar.rotation == 0) {
          current.scaleY = currentStar.scale;
        }
        else {
          current.scaleX = currentStar.scale;
          current.scaleY = currentStar.scale;
        }

        current.setVelocityX(-currentStar.speed);

        if (currentStar.scale < 0.8) {
          current.setRotation(currentStar.rotation);
        }

        starScene.stars.push(current);
      });
    });

    let overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 1.0);
    overlay.fillRect(0, 0, config.phaser.width, config.phaser.height);
    overlay.alpha = 0.5;
  }

  update() {
  }
}
export default StarScene;
