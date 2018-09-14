const title_wiggle = 10;
const title_speed = 3;

const TitleScene = new Phaser.Class({
  Extends: Phaser.Scene,
  active: true,
  initialize: function TitleScene () {
    Phaser.Scene.call(this, { key: 'title' });
  },

  preload: function () {
	scene = this;

	this.started = false;
    this.load.path = game.asset_path;
    this.load.multiatlas('multipass');
    this.load.tilemapTiledJSON('map', 'shapes.json');

    Player.load();
    Enemy.load();

    TitleScene.start_x = screen.width / 2;
    TitleScene.start_y = screen.height / 3;

    this.load.audio('theme', ['audio/neoishiki.mp3']);

	add_keyboard_controls(this);

    let graphics = this.add.graphics();
  },

  create: function () {
    title = this.add.sprite(
      TitleScene.start_x,
      TitleScene.start_y,
      'multipass',
      'start/title'
    );
    scene.title_sprite = title;

    scene.music = this.sound.add('theme');

    scene.title_tween = scene.add.tween({
      targets: [scene.title_sprite],
      ease: 'Sine.easeInOut',
      duration: 1000,
      delay: 0,
      x: { getStart: scene.title_sprite.x, getEnd: scene.title_sprite.x },
      y: { getStart: scene.title_sprite.y, getEnd: scene.title_sprite.y },
      alpha: { getStart: 1, getEnd: 0 }
    });
  },

  update: function () {
    if (scene.started && (scene.music.isPlaying == false)) {
      scene.music.play();
    };

    Player.update();
    Enemy.update();
  }
});
