import 'phaser';
import './styles/default.css'

const gameConfig = {
  type: Phaser.AUTO,
  width: screen.width,
  height: screen.height,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};


var game = new Phaser.Game(gameConfig);
var player;

function preload(){
  this.load.spritesheet('einstein', 'assets/images/einstein-spritesheet.png', { frameWidth: 96, frameHeight: 50 });
}

function create(){
  player = this.physics.add.sprite(148, 150, 'einstein');
  player.setCollideWorldBounds(true);
}

function update(){
  var cursors = this.input.keyboard.createCursorKeys();
  if (cursors.left.isDown) {
    player.setVelocityX(-100);
  }
  else if (cursors.right.isDown) {
    player.setVelocityX(100);
  }
  else if (cursors.up.isDown) {
    player.setVelocityY(-100);
  }
  else if (cursors.down.isDown) {
    player.setVelocityY(100);
  }
  else {
    player.setVelocityX(0);
    player.setVelocityY(0);
  }
}
