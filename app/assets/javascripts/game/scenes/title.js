const title_wiggle = 10;
const title_speed = 3;

const TitleScene = new Phaser.Class({
  Extends: Phaser.Scene,
  active: true,
  initialize: function TitleScene () {
    Phaser.Scene.call(this, { key: 'title' });
  },

  preload: function () {
	scene = this
    this.load.path = game.asset_path;
    this.load.multiatlas('multipass');
    this.load.tilemapTiledJSON('map', 'shapes.json');


    Player.load();
    Enemy.load();

    TitleScene.start_x = screen.width / 2;
    TitleScene.start_y = screen.height / 3;

    this.load.audio('theme', ['audio/neoishiki.mp3']);

	add_keyboard_controls(this);
  },

  create: function () {
    title = title_sprite = this.add.sprite(
      TitleScene.start_x,
      TitleScene.start_y,
      'multipass',
      'start/title'
    );
    TitleScene.title_sprite = title;
  },

  update: function () {
    Player.update();
    Enemy.update();
  }
});
