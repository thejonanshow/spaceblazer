const EndScene = new Phaser.Class({
  Extends: Phaser.Scene,
  active: false,
  initialize: function EndScene () {
    Phaser.Scene.call(this, { key: 'end' });
  },

  preload: function () {
    console.log("End preload");
    this.load.path = game.asset_path;
  },
  create: function () {
    console.log("End create");
  },
  update: function () {
  }
});
