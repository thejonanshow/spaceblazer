function new_game() {
  App.cable.subscriptions.subscriptions[0].perform(
    "new_game",
    {
      id: game.fingerprint,
    }
  );
}

class TitleScene extends Phaser.Scene {
  constructor() {
    super('title');
    this.name = 'title';
  }

  preload() {
    this.started = false;
    this.load.path = assetPath
    this.load.multiatlas('multipass');
    this.load.tilemapTiledJSON('map', 'shapes.json');
    
    Player.load(this);
    Enemy.load(this);

    TitleScene.start_x = screen.width / 2;
    TitleScene.start_y = screen.height / 3;

    this.load.audio('theme', ['audio/neoishiki.mp3']);

    add_keyboard_controls(this);
  }

  create() {
    new_game();

    this.title_sprite = this.add.sprite(
      TitleScene.start_x,
      TitleScene.start_y,
      'multipass',
      'start/title'
    );
  }
}
