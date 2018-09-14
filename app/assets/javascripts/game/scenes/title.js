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
    title = TitleScene.title_sprite;
    x_min = TitleScene.start_x - title_wiggle;
    x_max = TitleScene.start_x + title_wiggle;
    y_min = TitleScene.start_y - title_wiggle;
    y_max = TitleScene.start_y + title_wiggle;

    // if ((title.x < x_min) || (title.x > x_max)) {
    //   title.setVelocityX(title.velocity.x *= -1);
    // }
    // else if ((title.y < y_min) || (title.y > y_max)) {
    //   title.setVelocityX(title.velocity.y *= -1);
    // }
  }
});
