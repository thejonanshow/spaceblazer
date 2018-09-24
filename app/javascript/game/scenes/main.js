import { assetPath } from 'helpers/asset_path';
import config from 'game/config';
import { addKeyboardControls } from 'game/keyboard';

import Enemy from 'game/enemy';
import Player from 'game/player';
import Bullet from 'game/bullet';

import Spaceblazer from 'spaceblazer';

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
    this.started = false;
    this.worldCollisionOffset = 0;
    this.GAMETIMER_SEC = "";

    this.gameTimerText = this.add.text(
      (config.phaser.width / 2),
      (config.phaser.height / 8),
      this.COUNTDOWN_TEXT,
      { fontSize: '72px', fill: '#fff' }
    ).setOrigin(0.5, 0.5);


    this.load.path = '/';
    this.load.json('spaceblazerConfig', '../spaceblazer_config.json');

    this.load.path = assetPath();

    this.load.multiatlas('multipass', 'multipass.json');
    this.load.json('shapes');
    this.load.audio('sfx', 'audio/playerstart.wav');
    this.load.audio('theme', 'audio/neoishiki.mp3');
    this.load.animation('cloud', 'animations/powerups/cloud/cloud.json'); 

    if (config.first_game) {
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
      config.phaser.width + (2 * this.worldCollisionOffset),
      config.phaser.height + (2 * this.worldCollisionOffset)
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

    this.centerX = config.phaser.width / 2;
    this.textY = config.phaser.height * 0.75;

    this.waitingText = this.add.text(this.centerX, this.textY, '', { fontSize: '24px', fill: '#fff' });
    this.waitingText.originX = 0.5;

    this.NUM_PLAYERS = spaceblazerConfig("minimum_players");
  }

  update() {
    if (this.started && !config.reset) {
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

      this.COUNTDOWN_TEXT = config.game_start_countdown_ms / 1000;

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

  finish() {
    this.spaceblazer.finishGame();
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
    overlay.fillRect(0, 0, MainScene.width, MainScene.height);
    overlay.alpha = 0.5;

    winner.scoreText.setAlpha(0);
    winner.sprite.setPosition((MainScene.width / 2), (MainScene.height / 2));
    winner.sprite.setScale(2);
    winner.sprite.setDepth(Infinity);

    this.gameTimerText.setDepth(Infinity);
    this.gameTimerText.setText(winner.displayName() + " wins!");
    this.add.text(
      (MainScene.width / 2),
      (MainScene.height * 0.8),
      "CONGRATULATIONS!",
      { fontSize: '72px', fill: '#fff' }
    ).setOrigin(0.5, 0.5);
    this.add.text(
      (MainScene.width / 2),
      (MainScene.height * 0.9),
      "(push start to play again)",
      { fontSize: '50px', fill: '#fff' }
    ).setOrigin(0.5, 0.5);
    this.gameTimerText.originX = 0.5;

    MainScene.reset = true;

    this.music.stop();
  }

  updateGameTimer() {
    this.GAMETIMER_SEC--;
    this.gameTimerText.setText(this.GAMETIMER_SEC);

    if (this.GAMETIMER_SEC === 0) {
      this.gameTimer.destroy();
      this.gameTimerText.setText("");
      this.finish();
    }
  }

  startGameTimer() {
    this.GAMETIMER_SEC = MainScene.GAME_FINISH_COUNTDOWN;
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
export default MainScene;
