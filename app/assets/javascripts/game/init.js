//= require cable
//= require_tree .
//= require_self

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
  scene: [TitleScene, MainScene, EndScene],
  audio: {
    disableWebAudio: true
  }
};

let game = new Phaser.Game(gameConfig);
// game.asset_path = 'https://s3-us-west-1.amazonaws.com/spaceblazer/';
game.asset_path = "/offline/";

let debug = false;
let scene = {};
let enemies = {};
let players = {};
let bullets = {};
