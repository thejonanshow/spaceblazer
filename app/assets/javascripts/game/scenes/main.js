class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'main', active: false });
    this.name = 'main';
    this.NUM_PLAYERS = 2;
  }

  preload() {
    this.load.path = assetPath
    this.load.multiatlas('multipass');
    this.load.tilemapTiledJSON('map', 'shapes.json');

    Player.load(this);
    Enemy.load(this);

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
    if (this.started && (this.music.isPlaying == false)) {
      this.music.play({ loop: true });
    };

    // Start the game when NUM_PLAYERS have pressed start
    let playerCount = Object.keys(Player.activePlayers).length;
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

    Player.update(this);
    Enemy.update(this);
  }

  updateCountdown() {
    this.COUNTDOWN_TEXT--;
    this.countdownText.setText(this.COUNTDOWN_TEXT);

    if (this.COUNTDOWN_TEXT === 0) {
      this.countdownEvent.destroy();
      this.countdownText.destroy();
      this.started = true;
    }
  }
}
