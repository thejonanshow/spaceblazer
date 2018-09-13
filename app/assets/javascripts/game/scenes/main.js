var frameNames;
const MainScene = new Phaser.Class({
  Extends: Phaser.Scene,
  active: false,
  initialize: function MainScene () {
    Phaser.Scene.call(this, { key: 'main' });
  },

  preload: function () {
    this.load.path = 'https://s3-us-west-1.amazonaws.com/spaceblazer/';
    scene = this;
  },

  create: function () {
    Player.load();
    Enemy.load();

    let music = this.sound.add('theme');
    music.play();
  },

  update: function () {
  }
});
