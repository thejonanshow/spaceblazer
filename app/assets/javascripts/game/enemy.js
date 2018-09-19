class Enemy {
  constructor(id, scene) {
    this.scene = scene;

    if (typeof(id) === "undefined") {
      this.id = Enemy.generateId();
    } else if (id === null) {
      return;
    } else {
      debugLog("Revived " + id);
      this.id = id;
    }

    this.avatarName = 'server';
    this.shape = this.scene.shapes['server1'];
    this.spawn = Enemy.getSpawnPoint();
    this.bullets = [];
    this.direction = Enemy.directions[Math.floor(Math.random() * Enemy.directions.length)];
    this.speed = spaceblazerConfig("default_enemy_speed");

    this.sprite = this.scene.matter.add.sprite(
      this.spawn.x,
      this.spawn.y,
      'multipass',
      this.firstFrame,
      { shape: this.shape }
    );

    this.sprite.originX = 0.5;
    this.sprite.originY = 0.5;

    debugLog("New enemy in scene " + scene.name + ' with ID ' + this.id);

    this.sprite.play(this.avatarName);
    this.sprite.wrapper = this;
    this.sprite.setCollisionCategory(Enemy.collisionCategory);
    this.sprite.setFriction(0, 0, 0);
    this.sprite.setFixedRotation(0);

    this.bulletType = 'floppy';
    this.bulletOffset = { x: -30, y: 0 };

    Enemy.activeEnemies[this.id] = this;
  };

  static generateId() {
    return ("enemy" + (Object.keys(Enemy.activeEnemies).length + 1));
  }

  static width() {
    return 105;
  };

  static height() {
    return 167;
  };

  static getSpawnPoint() {
    let spawnX = Enemy.spawnOffset.x - (Enemy.width() / 2);
    let spawnY = Enemy.spawnOffset.y + (Enemy.height() / 2);
    let spawnPoint = { x: spawnX, y: spawnY };

    debugLog('Enemy spawn: ' + JSON.stringify(spawnPoint));

    if (screen.height > (spawnPoint.y + (Enemy.height() * 2) + 50)) {
      Enemy.spawnOffset.y += (Enemy.height() + 10);
    }
    else if (screen.availWidth > (spawnPoint.x - (Enemy.width() + 10))) {
      Enemy.spawnOffset.x -= (Enemy.width() + 10);
      Enemy.spawnOffset.y = 10;
    }
    else {
      Enemy.spawnOffset = { x: (screen.width - 10), y: 10 };
    }

    return spawnPoint;;
  };

  static load(currentScene) {
    Enemy.collisionCategory = currentScene.matter.world.nextCategory();

    currentScene.load.animation('server', 'animations/enemies/server.json');
    currentScene.load.animation('server_explosion', 'animations/explosions/server/explosion.json'); 
  };

  static update(currentScene) {
    if (currentScene.started) {
      Object.values(Enemy.activeEnemies).forEach(function(enemy) {
        if (enemy != null) {
          enemy.fire(currentScene);
        }
      });

      let timeNow = currentScene.time.now;
      const ENEMY_RESWPAWN_DELAY_MS = 3000;
      Object.keys(Enemy.deadEnemies).forEach(function(timeOfDeath) {
        if (timeOfDeath != null) {
          if ((timeNow - timeOfDeath) > ENEMY_RESWPAWN_DELAY_MS) {
            let deadEnemyId = Enemy.deadEnemies[timeOfDeath]

            if (Enemy.activeEnemies[deadEnemyId] == null) {
              if (deadEnemyId != null) {
                debugLog("Reviving dead enemy: " + deadEnemyId);
                Enemy.deadEnemies[timeOfDeath] = null;
                new Enemy(deadEnemyId, currentScene);
              }
            }
          }
        }
      });
    }
  };

  update() {
  }

  static firstFrameName(avatarName) {
    return ("enemies/" + avatarName + "1");
  }

  startMoving() {
    if (this.direction == "NE") {
      moveUp(this);
      moveRight(this);
    }
    else if (this.direction == "SE") {
      moveDown(this);
      moveRight(this);
    }
    else if (this.direction == "SW") {
      moveDown(this);
      moveLeft(this);
    }
    else if (this.direction == "NW") {
      moveUp(this);
      moveLeft(this);
    }
  };

  bounce() {
    let topEdge = this.sprite.y <= this.sprite.height;
    let rightEdge = this.sprite.x >= (game.width - this.sprite.width);
    let bottomEdge = this.sprite.y >= (game.height - this.sprite.height);
    let leftEdge = this.sprite.x <= this.sprite.width;

    if (topEdge && leftEdge) {
      this.direction = "SE";
    }
    else if (topEdge && rightEdge) {
      this.direction = "SW";
    }
    else if (bottomEdge && leftEdge) {
      this.direction = "NE";
    }
    else if (bottomEdge && rightEdge) {
      this.direction = "NW";
    }
    else if (bottomEdge) {
      if (this.direction == "SW") {
        this.direction = "NW";
      }
      else {
        this.direction = "NE";
      }
    }
    else if (topEdge) {
      if (this.direction == "NW") {
        this.direction = "SW";
      }
      else {
        this.direction = "SE";
      }
    }
    else if (rightEdge) {
      if (this.direction == "NE") {
        this.direction = "NW";
      }
      else {
        this.direction = "SW";
      }
    }
    else if (leftEdge) {
      if (this.direction == "NW") {
        this.direction = "NE";
      }
      else  {
        this.direction = "SE";
      }
    }

    stop(this);
    this.startMoving();
  };

  fire() {
    if (this.bullets.length > 0) {
      return;
    }

    let options = {};

    if (this.sprite.x < (this.sprite.width * [5,6,7,8].sample())) {
      options.reverse_direction = true;
    }

    let bullet = new Bullet(this, options);

    Enemy.allBullets.push(bullet);
    this.bullets.push(bullet);
  };

  destroy() {
    let deadId = this.id;
    let explosion = this.scene.add.sprite(this.sprite.x, this.sprite.y, 'animations/explosions/server/explosion1');
    explosion.play('server_explosion');

    this.sprite.destroy();
    delete Enemy.activeEnemies[deadId];

    this.scene.time.addEvent({
      delay: 3000,
      callback: function() {
        let newEnemy = new Enemy(deadId, this);
        newEnemy.startMoving();
      },
      callbackScope: this.scene
    });
  };

  collision(bodyA, bodyB) {
    if (bodyA.parent.gameObject && bodyB.parent.gameObject) {
      if (bodyA.parent.gameObject.wrapper && bodyB.parent.gameObject.wrapper) {
        let enemy = bodyA.parent.gameObject.wrapper;
        let bullet = bodyB.parent.gameObject.wrapper;

        bullet.owner.scoreEvent('destroy_enemy');
        bullet.destroy();
        enemy.destroy();
      }
      else {
      }
    }
    else if (bodyA.parent.gameObject) {
      if (bodyA.parent.gameObject.wrapper) {
        let enemy = bodyA.parent.gameObject.wrapper;
        enemy.bounce()
      }
      else {
      }
    }
    else {
    }
  }
};
Enemy.speed = 10;
Enemy.activeEnemies = {};
Enemy.allBullets = [];
Enemy.allEnemies = [];
Enemy.deadEnemies = {};
Enemy.spawnOffset = { x: (screen.width - 10), y: 10 };
Enemy.directions = ["NE", "SE", "SW", "NW"]
