class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'main', active: false });
    this.NUM_PLAYERS = 2;
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

    this.center_x = this.physics.world.bounds.centerX;
    this.topThird_y = this.physics.world.bounds.height / 3;

    this.waitingText = this.add.text(this.center_x, this.topThird_y, '', { fontSize: '24px', fill: '#fff' });
    this.waitingText.originX = 0.5;
  }

  update() {
    if (scene.started && (this.music.isPlaying == false)) {
      this.music.play({ loop: true });
    };

    // Start the game when NUM_PLAYERS have pressed start
    let playerCount = Object.keys(Player.active_players).length;
    this.waitingText.setText(`Waiting for ${this.NUM_PLAYERS - playerCount} more player(s). Press start to join.`);

    if (playerCount === this.NUM_PLAYERS && !this.countdownStarted) {
      this.waitingText.destroy();
      this.countdownStarted = true;

      const COUNTDOWN_MS = 3000;
      this.COUNTDOWN_TEXT = COUNTDOWN_MS / 1000;
      this.countdownText = this.add.text(this.center_x, this.topThird_y, this.COUNTDOWN_TEXT, { fontSize: '256px', fill: '#fff' });

      this.countdownEvent = this.time.addEvent({
        delay: 1000,
        loop: true,
        callback: this.updateCountdown,
        callbackScope: this
      });
    }

    Player.update();
    Enemy.update();
  }

  updateCountdown() {
    this.COUNTDOWN_TEXT--;
    this.countdownText.setText(this.COUNTDOWN_TEXT);

    if (this.COUNTDOWN_TEXT === 0) {
      this.countdownEvent.destroy();
      this.countdownText.destroy();
      scene.started = true;
    }
  }
}
