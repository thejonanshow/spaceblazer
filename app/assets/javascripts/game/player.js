class Player {
  constructor(id, avatar, game_id, scene) {
    this.scene = scene;
    this.id = id;
    this.avatar = avatar;
    this.game_id = game_id;
    this.spawn = Player.getSpawnPoint();
    this.bullets = [];
    this.rotation = 0;

    this.sprite = Player.players.create(this.spawn.x, this.spawn.y, this.avatar + '1');
    this.sprite.play(this.avatar);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.wrapper = this;

    this.score = 0;
    this.scoreText = scene.add.text(this.scoreX(), this.scoreY(), this.score, { fontSize: '18px', fill: '#fff' });

    this.bullet = 'rainbow_bomb';

    Player.activePlayers[this.id] = this;

    scene.sfx.play('newplayer');

    debugLog("New player in scene " + scene.name + ' with ID ' + this.id);
  };

  static width() {
    return 212;
  };

  static height() {
    return 125;
  };

  scoreX() {
    //left side of sprite
    return this.sprite.x - (this.sprite.width * this.sprite.originX);
  }

  scoreY() {
    // just above center vertically
    return this.sprite.y - (this.sprite.height * .1);
  }

  static getSpawnPoint() {
    let spawnX = Player.spawnOffset.x + (Player.width() / 2);
    let spawnY = Player.spawnOffset.y + (Player.height() / 2) 
    let spawnPoint = { x: spawnX, y: spawnY };

    debugLog('Player spawn: ' + JSON.stringify(spawnPoint));

    if (screen.height > (spawnPoint.y + (Player.height() * 2) + 50)) {
      Player.spawnOffset.y += (Player.height() + 10);
    }
    else if (screen.availWidth > (spawnPoint.x + Player.width() + 10)) {
      Player.spawnOffset.x += (Player.width() + 10);
      Player.spawnOffset.y = 10;
    }
    else {
      Player.spawnOffset = { x: 10, y: 10 };
    }

    return spawnPoint;
  };

  static load(currentScene) {
    Player.players = currentScene.physics.add.group();
    Player.bullets = currentScene.physics.add.group();

    let names = ['appy', 'blaze', 'cloudy', 'codey', 'earnie', 'einstein', 'hootie', 'koa', 'astro']
	names.forEach(function(name) {
	  currentScene.load.animation(name, './animations/players/' + name + '.json'); 
    });

    currentScene.load.animation('rainbow_bomb', 'animations/bullets/rainbow_bomb.json');
  };

  static create(data, currentScene) {
    let player = new Player(data.id, data.avatar, data.game_id, currentScene);
    new Enemy(Enemy.generateId(), currentScene);
  };

  static update() {
    Object.values(Player.activePlayers).forEach(function(player) {
      player.cleanup();
    });
  };

  mayday() {
    this.rotation = 1;
  }

  checkMayday() {
    if (this.rotation >= 6) {
      this.rotation = 0;
      this.sprite.setRotation(this.rotation);
    }
    else if (this.rotation > 0) {
      this.sprite.setRotation(this.rotation);
      this.rotation += 1;
    }
  }

  cleanupBullets() {
    let player = this;

    player.bullets.forEach(function(bullet) {
      if ((bullet.x > screen.width) || (bullet.active == false)) {
        bullet.destroy();
        player.bullets.remove(bullet);
      }
    });
  };

  moveScore() {
    this.scoreText.setPosition(this.scoreX(), this.scoreY());
  }

  cleanup() {
    this.cleanupBullets();
    this.checkMayday();
    this.moveScore();
  };

  fire() {
    if (this.bullets.length > 0) {
      return;
    }

    let bullet = Player.bullets.create(this.sprite.x + 50, this.sprite.y + 20, this.bullet + '1');
    this.scene.physics.add.collider(bullet, Enemy.enemies, this.bulletStrike, null, this.scene);
    this.bullets.push(bullet);
    bullet.play(this.bullet);
    bullet.setVelocityX(Player.bulletSpeed);
  };

  bulletStrike(bullet, enemy) {
    enemy.wrapper.die();
    bullet.destroy();
  };

  // Increment score by amount or by 1 if amount not specified
  incrementScore(amount) {
    this.updateScore(amount || 1);
  }

  // Decrement score by amount or by 1 if amount not specified
  decrementScore(amount) {
    this.updateScore(amount || -1);
  }

  updateScore(amount) {
    this.score = this.score + amount
    this.scoreText.setText(this.score);
  }
};

Player.activePlayers = {};
Player.speed = 200;
Player.bulletSpeed = 500;
Player.spawnOffset = { x: 10, y: 10 };
