class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'main', active: false });
  }

  preload() {
    scene = this;

    this.load.path = game.asset_path
    this.load.multiatlas('multipass');
    this.load.tilemapTiledJSON('map', 'shapes.json');

    Player.load();
    Enemy.load();

    add_keyboard_controls(this);
  }

  create() {
    this.music = this.sound.add('theme');
  }

  update() {
    if (scene.started && (this.music.isPlaying == false)) {
      this.music.play({ loop: true });
    };

    Player.update();
    Enemy.update();
  }
}
