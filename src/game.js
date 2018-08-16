import 'phaser';

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
var keyboardEnabled = false;

import einstein from '../assets/images/einstein-spritesheet.png'
import smallStars from '../assets/images/small-stars.png'
import mediumStars from '../assets/images/medium-stars.png'
import bigStars from '../assets/images/big-stars.png'
import bullet from '../assets/images/bullet.png'

function preload(){
  this.load.spritesheet('einstein', einstein, { frameWidth: 96, frameHeight: 50 });
  this.load.spritesheet('small-stars', smallStars, { frameWidth: 1280, frameHeight: 800 });
  this.load.spritesheet('medium-stars', mediumStars, { frameWidth: 1280, frameHeight: 800 });
  this.load.spritesheet('big-stars', bigStars, { frameWidth: 1280, frameHeight: 800 });
  this.load.spritesheet('bullet', bullet, { frameWidth: 30, frameHeight: 30 });
}

var small;
var medium;
var big;
var rainbow;
var game;

function create(){
  game = this;
  small = this.add.tileSprite(0, 0, 1280, 800, "small-stars");
  medium = this.add.tileSprite(0, 0, 1280, 800, "medium-stars");
  big = this.add.tileSprite(0, 0, 1280, 800, "big-stars");
  player = this.physics.add.sprite(148, 150, 'einstein');
  player.setCollideWorldBounds(true);
}

function update(){
  small.tilePositionX += 0.05;
  medium.tilePositionX += 0.3;
  big.tilePositionX += 0.75;
}

function fire(){
  rainbow = game.physics.add.sprite(player.x, player.y, 'bullet');
  rainbow.setVelocityX(300);
}

function moveUp(){
  player.setVelocityY(-100);
}

function moveDown(){
  player.setVelocityY(100);
}

function moveLeft(){
  player.setVelocityX(-100);
}

function moveRight(){
  player.setVelocityX(100);
}

function stop(){
  player.setVelocityX(0);
  player.setVelocityY(0);
}

function stopX(){
  player.setVelocityX(0);
}

function stopY(){
  player.setVelocityY(0);
}

export { moveUp, moveDown, moveRight, moveLeft, stop, stopX, stopY, fire }
