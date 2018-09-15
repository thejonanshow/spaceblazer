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
    let music = this.sound.add('theme');
    music.play();
  }

  update() {
    if (scene.started && (scene.music.isPlaying == false)) {
      scene.music.play();
    };

    Player.update();
    Enemy.update();
  }
}
