function new_game() {
  App.cable.subscriptions.subscriptions[0].perform(
    "new_game",
    {
      id: game.fingerprint,
    }
  );
}

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'main', active: true });
    this.name = 'main';
  }

  preload() {
    this.started = false;
    this.load.path = assetPath
    this.load.multiatlas('multipass');
    this.load.tilemapTiledJSON('map', 'shapes.json');
    this.load.json('spaceblazerConfig', '../spaceblazer_config.json');

    Player.load(this);
    Enemy.load(this);

    this.startX = screen.width / 2;
    this.startY = screen.height / 3;

    this.load.audio('theme', ['audio/neoishiki.mp3']);

    addKeyboardControls(this);
  }

  create() {
    new_game();

    this.titleSprite = this.add.sprite(
      this.startX,
      this.startY,
      'multipass',
      'start/title'
    );

    this.music = this.sound.add('theme');

    this.centerX = this.physics.world.bounds.centerX;
    this.textY = this.physics.world.bounds.height * 0.75;

    this.waitingText = this.add.text(this.centerX, this.textY, '', { fontSize: '24px', fill: '#fff' });
    this.waitingText.originX = 0.5;

    this.NUM_PLAYERS = spaceblazerConfig("minimum_players");
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
