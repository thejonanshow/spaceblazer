//= require cable
//= require_tree .
//= require fingerprint2
//= require_self

const gameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: [StarScene, MainScene],
  audio: {
    disableWebAudio: true
  }
};

let game = new Phaser.Game(gameConfig);
game.width = window.innerWidth;
game.height = window.innerHeight;

let debug = false;
let enemies = {};
let players = {};
let bullets = {};

new Fingerprint2().get(
  function(result, components) {
    game.fingerprint = result;
    connectCable(game.fingerprint);
  }
);
