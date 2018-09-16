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

    const waitingText_x = this.physics.world.bounds.centerX;
    const waitingText_y = this.physics.world.bounds.height / 3;

    this.waitingText = this.add.text(waitingText_x, waitingText_y, '', { fontSize: '24px', fill: '#fff' });
    this.waitingText.originX = 0.5;
  }

  update() {
    if (scene.started && (this.music.isPlaying == false)) {
      this.music.play({ loop: true });
    };

    Player.update();
    Enemy.update();
  }
}
