const TitleScene = new Phaser.Class({
  Extends: Phaser.Scene,
  active: true,
  initialize: function TitleScene () {
    Phaser.Scene.call(this, { key: 'title' });
  },

  preload: function () {
    console.log("Title preload");
    this.load.path = 'https://s3-us-west-1.amazonaws.com/spaceblazer/';
  },
  create: function () {
    console.log("Title create");
    this.add.text(75, 170, 'Spaceblazer', { fontSize: '100px', color: '#FFFFFF' });
  },
  update: function () {}
});
