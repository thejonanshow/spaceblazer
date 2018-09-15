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
  }

  update() {
    if (scene.started && (scene.music.isPlaying == false)) {
      scene.music.play();
    };

    Player.update();
  }
}
