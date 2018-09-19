class Player {
  constructor(id, avatar, game_id, scene) {
    this.scene = scene;
    this.id = id;
    this.avatarName = avatar;
    this.game_id = game_id;
    this.spawn = Player.getSpawnPoint();
    this.bullets = [];
    this.rotation = 0;
    this.speed = spaceblazerConfig("default_player_speed");
    this.shape = this.scene.shapes['astro_blue1'];
    this.firstFrame = Player.firstFrameName(this.avatarName);

    this.sprite = this.scene.matter.add.sprite(
      this.spawn.x,
      this.spawn.y,
      'multipass',
      this.firstFrame,
      { shape: this.shape }
    );

    this.sprite.play(this.avatarName);
    this.sprite.wrapper = this;
    this.sprite.setIgnoreGravity(true);
    this.sprite.setFriction(0, 0, 0);
    this.sprite.setCollisionCategory(Player.collisionCategory);
    this.sprite.setFixedRotation(0);

    this.bulletType = 'rainbow_bomb';
    this.bulletOffset = { x: 50, y: 20 };

    this.score = 0;
    this.scoreText = scene.add.text(this.scoreX(), this.scoreY(), this.score, { fontSize: '18px', fill: '#fff' });

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
    Player.collisionCategory = currentScene.matter.world.nextCategory();

    let names = ['appy', 'blaze', 'cloudy', 'codey', 'earnie', 'einstein', 'hootie', 'koa', 'astro']
	names.forEach(function(name) {
	  currentScene.load.animation(name, './animations/players/' + name + '.json'); 
    });
  };

  static create(data, currentScene) {
    let player = new Player(data.id, data.avatar, data.game_id, currentScene);
    new Enemy(Enemy.generateId(), currentScene);
  };

  static update() {
    Object.values(Player.activePlayers).forEach(function(player) {
      player.update();
    });
  };

  static firstFrameName(avatarName) {
    return ("players/" + avatarName.replace("_", "/") + "/" + avatarName + "1");
  }

  scoreX() {
    //left side of sprite
    return this.sprite.x - (this.sprite.width * this.sprite.originX);
  }

  scoreY() {
    // just above center vertically
    return this.sprite.y - (this.sprite.height * .1);
  }

  mayday() {
    this.rotation = 1;
    this.decrementScore();
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

  moveScore() {
    this.scoreText.setPosition(this.scoreX(), this.scoreY());
  }

  update() {
    this.checkMayday();
    this.moveScore();
  }

  bounce() {
  }

  fire() {
    if (this.bullets.length > 0) {
      return;
    }

    let bullet = new Bullet(this);

    Player.allBullets.push(bullet);
    this.bullets.push(bullet);
  };

  collision(bodyA, bodyB) {
    if (bodyA.gameObject && bodyB.gameObject) {
    }
    else {
      if (bodyA.gameObject) {
        let player = bodyA.gameObject.wrapper;
        player.bounce();
      }
      else if (bodyB.gameObject) {
      }
    }
  }

  scoreEvent(eventType) {
    this.updateScore(Player.scores[eventType]);
  }

  updateScore(amount) {
    this.score = this.score + amount

    if (this.score < 0) {
      this.score = 0;
    }

    this.scoreText.setText(this.score);
  }
};

Player.activePlayers = {};
Player.allPlayers = [];
Player.allBullets = [];
Player.spawnOffset = { x: 10, y: 10 };

Player.scores = {
  destroy_enemy: 50,
  destroy_bullet: 20,
  touch_enemy: -40,
  touch_bullet: -50
}
