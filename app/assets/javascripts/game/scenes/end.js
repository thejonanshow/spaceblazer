const EndScene = new Phaser.Class({
  Extends: Phaser.Scene,
  active: false,
  initialize: function EndScene () {
    Phaser.Scene.call(this, { key: 'end' });
  },

  preload: function () {
    console.log("End preload");
    this.load.path = 'https://s3-us-west-1.amazonaws.com/spaceblazer/';
  },
  create: function () {
    console.log("End create");
  },
  update: function () {
  }
});
