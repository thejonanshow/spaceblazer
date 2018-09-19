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
    game.mainScene = this;
    this.started = false;
    this.worldCollisionOffset = 0;

    this.load.path = '/';
    this.load.json('spaceblazerConfig', '../spaceblazer_config.json');

    this.load.path = getAssetPath();

    this.load.multiatlas('multipass', 'multipass.json');
    this.load.json('shapes');
    this.load.audio('sfx', 'audio/playerstart.wav');
    this.load.audio('theme', 'audio/neoishiki.mp3');
    this.load.animation('cloud', 'animations/powerups/cloud/cloud.json'); 

    Player.load(this);
    Enemy.load(this);
    Bullet.load(this);

    this.startX = screen.width / 2;
    this.startY = screen.height / 3;

    addKeyboardControls(this);

    this.matter.world.on('collisionstart', function(event, bodyA, bodyB) {
      if (bodyA.parent && bodyA.parent.gameObject && bodyA.parent.gameObject.wrapper) {
        console.log(bodyA);
        console.log(bodyB);
        bodyA.parent.gameObject.wrapper.collision(bodyA, bodyB);
      }
      else if (bodyB.parent && bodyB.parent.gameObject && bodyB.parent.gameObject.wrapper) {
        bodyB.parent.gameObject.wrapper.collision(bodyB, bodyA);
      }
      else {
      }
    });

    this.matter.world.setBounds(
      -this.worldCollisionOffset,
      -this.worldCollisionOffset,
      game.width + (2 * this.worldCollisionOffset),
      game.height + (2 * this.worldCollisionOffset)
    );

    this.matter.world.disableGravity();
    this.matter.enableWrapPlugin();
  }

  create() {
    new_game();

    this.logoVisible = true;

    this.shapes = this.cache.json.get('shapes');

    this.titleSprite = this.add.sprite(
      this.startX,
      this.startY,
      'multipass',
      'start/title'
    );

    this.titleTween = this.add.tween({
      targets: this.titleSprite,
      ease: 'Sine.easeInOut',
      duration: 1000,
      alpha: 0,
      paused: true,
      onComplete: function() {
        this.logoVisible = false;
      }
    });

    this.sfx = this.sound.add('sfx');
    addSfxMarkers(this);

    this.music = this.sound.add('theme');

    this.centerX = game.width / 2;
    this.textY = game.height * 0.75;

    this.waitingText = this.add.text(this.centerX, this.textY, '', { fontSize: '24px', fill: '#fff' });
    this.waitingText.originX = 0.5;

    this.NUM_PLAYERS = spaceblazerConfig("minimum_players");
  }

  update() {
    // if (this.started) {
    //   if (this.music.isPlaying == false) {
    //     this.music.play({ loop: true });
    //   }
    // }

    if (this.countdownStarted) {
      if (this.logoVisible) {
        this.titleTween.play();
      }
    }

    // Start the game when NUM_PLAYERS have pressed start
    let playerCount = Object.keys(Player.activePlayers).length;
    this.waitingText.setText(`Waiting for ${this.NUM_PLAYERS - playerCount} more player(s). Press start to join.`);

    if (playerCount === this.NUM_PLAYERS && !this.countdownStarted) {
      this.waitingText.destroy();
      this.countdownStarted = true;

      const COUNTDOWN_MS = 3000;
      this.COUNTDOWN_TEXT = COUNTDOWN_MS / 1000;
      this.countdownText = this.add.text(this.centerX, this.textY, this.COUNTDOWN_TEXT, { fontSize: '256px', fill: '#fff' })
        .setOrigin(0.5, 0.5);

      this.countdownEvent = this.time.addEvent({
        delay: 1000,
        loop: true,
        callback: this.updateCountdown,
        callbackScope: this
      });
    }

    Player.update(this);
    Enemy.update(this);
    Bullet.update(this);
  }

  start() {
    this.started = true;
    Object.keys(Enemy.activeEnemies).forEach(function(key) {
      Enemy.activeEnemies[key].startMoving();
    });
  }

  updateCountdown() {
    this.COUNTDOWN_TEXT--;
    this.countdownText.setText(this.COUNTDOWN_TEXT);

    if (this.COUNTDOWN_TEXT === 0) {
      this.countdownEvent.destroy();
      this.countdownText.destroy();
      this.start();
    }
  }
}
