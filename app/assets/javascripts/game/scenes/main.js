class Spaceblazer {
  static newGame() {
    Cable.send('new_game', { id: game.fingerprint });
  }

  static fetchGame() {
    Cable.send('fetch_game', { id: game.fingerprint });
  }

  static finishGame() {
    Cable.send('finish_game', { id: game.fingerprint });
  }

  static init() {
    Player.init();
    Enemy.init();
    Bullet.init();
  }

  static destroySprites() {
    Player.destroyAllSprites();
    Enemy.destroyAllSprites();
    Bullet.destroyAllSprites();
  }

  static restart() {
    Spaceblazer.firstGame = false;
    game.mainScene.reset();
    game.mainScene.scene.stop();
    Spaceblazer.destroySprites();
    game.mainScene.scene.restart();
    Spaceblazer.init();
  }
}
Spaceblazer.reset = false;
Spaceblazer.firstGame = true;
Spaceblazer.GAME_FINISH_COUNTDOWN = 60;
Spaceblazer.GAME_START_COUNTDOWN_MS = 3000;

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'main', active: true });
    this.name = 'main';
  }

  reset() {
    this.GAMETIMER_SEC = "";
    this.started = false;
    this.logoVisible = true;
    this.countdownStarted = false;
    this.COUNTDOWN_TEXT = '';
    this.gameTimerText = '';
    this.waitingText = '';
  }

  preload() {
    game.mainScene = this;
    this.started = false;
    this.last_save = { players: {} };
    this.worldCollisionOffset = 0;
    this.GAMETIMER_SEC = "";

    this.gameTimerText = this.add.text(
      (game.width / 2),
      (game.height / 8),
      this.COUNTDOWN_TEXT,
      { fontSize: '72px', fill: '#fff' }
    ).setOrigin(0.5, 0.5);


    this.load.path = '/';
    this.load.json('spaceblazerConfig', '../spaceblazer_config.json');

    this.load.path = getAssetPath();

    this.load.multiatlas('multipass', 'multipass.json');
    this.load.json('shapes');
    this.load.audio('sfx', 'audio/playerstart.wav');
    this.load.audio('theme', 'audio/neoishiki.mp3');
    this.load.animation('cloud', 'animations/powerups/cloud/cloud.json'); 

    if (Spaceblazer.firstGame) {
      Player.load(this);
      Enemy.load(this);
      Bullet.load(this);
    }

    this.startX = screen.width / 2;
    this.startY = screen.height / 3;

    this.matter.world.on('collisionstart', function(event, bodyA, bodyB) {
      if (bodyA.parent && bodyA.parent.gameObject && bodyA.parent.gameObject.wrapper) {
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
    addKeyboardControls(this);
    Spaceblazer.init();
    Spaceblazer.fetchGame();

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
    if (this.started && !Spaceblazer.reset) {
      if (this.music.isPlaying == false) {
        this.music.play({ loop: true });
      }
    }

    if (this.countdownStarted) {
      if (this.logoVisible) {
        this.titleTween.play();
      }
    }

    // Start the game when NUM_PLAYERS have pressed start
    let playerCount = Object.keys(Player.activePlayers).length;
    this.waitingText.setText(`Waiting for ${this.NUM_PLAYERS - playerCount} more player(s). Press start to join.`);

    if (playerCount >= this.NUM_PLAYERS && !this.countdownStarted) {
      this.waitingText.destroy();
      this.countdownStarted = true;

      this.COUNTDOWN_TEXT = Spaceblazer.GAME_START_COUNTDOWN_MS / 1000;

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

    this.save_game();
  }

  save_game() {
    let game_data = {
      action: "save_game",
      players: {}
    }

    let player_keys = Object.keys(Player.activePlayers)

    player_keys.forEach(function(key) {
      let player = Player.activePlayers[key]

      game_data.players[key] = {
        spawn_x: player.spawn.x,
        spawn_y: player.spawn.y,
        score: player.score,
        level: player.level,
        avatar_name: player.avatar
      }
    });

    game_data["time_remaining"] = this.GAMETIMER_SEC;

    if (sameValues(this.last_save, game_data)) {
    }
    else {
      this.last_save = game_data;
      Cable.send('save_game', game_data);
    }

  }

  start() {
    this.started = true;
    Object.keys(Enemy.activeEnemies).forEach(function(key) {
      Enemy.activeEnemies[key].startMoving();
    });
  }

  finish() {
    Spaceblazer.finishGame();
    let playerIds = Object.keys(Player.activePlayers);
    let winner = Player.activePlayers[playerIds[0]];;

    playerIds.forEach(function(playerId) {
      let currentPlayer = Player.activePlayers[playerId];

      if (currentPlayer.score > winner.score) {
        winner = currentPlayer;
      }
    });
    
    winner.sprite.winner = true;

    let overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 1.0);
    overlay.fillRect(0, 0, game.width, game.height);
    overlay.alpha = 0.5;

    winner.scoreText.setAlpha(0);
    winner.sprite.setPosition((game.width / 2), (game.height / 2));
    winner.sprite.setScale(2);
    winner.sprite.setDepth(Infinity);

    this.gameTimerText.setDepth(Infinity);
    this.gameTimerText.setText(winner.displayName() + " wins!");
    this.add.text(
      (game.width / 2),
      (game.height * 0.8),
      "CONGRATULATIONS!",
      { fontSize: '72px', fill: '#fff' }
    ).setOrigin(0.5, 0.5);
    this.add.text(
      (game.width / 2),
      (game.height * 0.9),
      "(push start to play again)",
      { fontSize: '50px', fill: '#fff' }
    ).setOrigin(0.5, 0.5);
    this.gameTimerText.originX = 0.5;

    Spaceblazer.reset = true;

    this.music.stop();
  }

  updateGameTimer() {
    this.GAMETIMER_SEC--;
    this.gameTimerText.setText(this.GAMETIMER_SEC);

    if (this.GAMETIMER_SEC <= 0) {
      this.GAMETIMER_SEC = Spaceblazer.GAME_FINISH_COUNTDOWN;
      this.save_game();
      this.gameTimer.destroy();
      this.gameTimerText.setText("");
      this.finish();
    }
  }

  startGameTimer() {
    this.GAMETIMER_SEC = Spaceblazer.GAME_FINISH_COUNTDOWN;
    this.gameTimer = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: this.updateGameTimer,
      callbackScope: this
    });
  }

  updateCountdown() {
    this.COUNTDOWN_TEXT--;
    this.countdownText.setText(this.COUNTDOWN_TEXT);

    if (this.COUNTDOWN_TEXT === 0) {
      this.countdownEvent.destroy();
      this.countdownText.destroy();
      this.start();
      this.startGameTimer();
    }
  }
}

