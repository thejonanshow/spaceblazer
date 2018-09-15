const title_wiggle = 10;
const title_speed = 3;

function new_game() {
  App.cable.subscriptions.subscriptions[0].perform(
    "new_game",
    {
      id: fingerprint,
    }
  );
}

class TitleScene extends Phaser.Scene {
  constructor() {
    super('title');
  }

  preload() {
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
  }

  create() {
    new_game();

    scene.title_sprite = this.add.sprite(
      TitleScene.start_x,
      TitleScene.start_y,
      'multipass',
      'start/title'
    );

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
  }

  update() {
    if (scene.started && (scene.music.isPlaying == false)) {
      scene.music.play();
    };

    Player.update();
    Enemy.update();
  }
}
