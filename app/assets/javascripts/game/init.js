//= require cable
//= require_tree .
//= require fingerprint2
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
  scene: [TitleScene, MainScene],
  audio: {
    disableWebAudio: true
  }
};

let game = new Phaser.Game(gameConfig);

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
