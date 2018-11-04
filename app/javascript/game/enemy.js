class Enemy {
  constructor(id, scene) {
    this.avatarName = 'server';
    this.state = {};
    this.bullets = [];
    this.bulletType = 'floppy';
    this.bulletOffset = { x: -30, y: 0 };
  };

  static init() {
    Enemy.speed = 10;
    Enemy.activeEnemies = {};
    Enemy.allBullets = [];
    Enemy.allEnemies = [];
    Enemy.deadEnemies = {};
    Enemy.spawnOffset = { x: (screen.width - 10), y: 10 };
    Enemy.directions = ["NE", "SE", "SW", "NW"]
  };

  static generateId() {
    return ("enemy" + (Object.keys(Enemy.activeEnemies).length + 1));
  };

  static width() {
    return 105;
  };

  static height() {
    return 167;
  };

  static getSpawnPoint() {
    let spawnX = Enemy.spawnOffset.x - (Enemy.width() / 2);
    let spawnY = Enemy.spawnOffset.y + (Enemy.height() / 2);
    let newSpawnPoint = { x: spawnX, y: spawnY };

    Spaceblazer.current.debugLog('Enemy spawn: ' + JSON.stringify(newSpawnPoint));

    if (screen.height > (newSpawnPoint.y + (Enemy.height() * 2) + 50)) {
      Enemy.spawnOffset.y += (Enemy.height() + 10);
    }
    else if (screen.availWidth > (newSpawnPoint.x - (Enemy.width() + 10))) {
      Enemy.spawnOffset.x -= (Enemy.width() + 10);
      Enemy.spawnOffset.y = 10;
    }
    else {
      Enemy.spawnOffset = { x: (screen.width - 10), y: 10 };
    }

    return newSpawnPoint;
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
                Spaceblazer.current.debugLog("Reviving dead enemy: " + deadEnemyId);
                Enemy.deadEnemies[timeOfDeath] = null;
                new Enemy(deadEnemyId, currentScene);
              }
            }
          }
        }
      });
    }
  };

  static firstFrameName(avatarName) {
    return ("enemies/" + avatarName + "1");
  };

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

  spawn() {
    if (typeof(id) === "undefined") {
      this.id = Enemy.generateId();
    } else if (id === null) {
      return;
    } else {
      Spaceblazer.current.debugLog("Revived " + id);
      this.id = id;
    }

    this.spawnPoint = Enemy.getSpawnPoint();
    this.scene = scene;
    this.shape = this.scene.shapes['server1'];
    this.direction = Enemy.directions[Math.floor(Math.random() * Enemy.directions.length)];
    this.speed = config.default_enemy_speed;

    this.sprite = this.scene.matter.add.sprite(
      this.spawnPoint.x,
      this.spawnPoint.y,
      'multipass',
      this.firstFrame,
      { shape: this.shape }
    );

    this.sprite.originX = 0.5;
    this.sprite.originY = 0.5;

    Spaceblazer.current.debugLog("New enemy in scene " + scene.name + ' with ID ' + this.id);

    this.sprite.play(this.avatarName);
    this.sprite.wrapper = this;
    this.sprite.setCollisionCategory(Enemy.collisionCategory);
    this.sprite.setFriction(0, 0, 0);
    this.sprite.setFixedRotation(0);

    Enemy.activeEnemies[this.id] = this;
  };

  update() {
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
    
    if ([1].sample() == 1) {
      new PowerUp(this);
    }
    new Explosion(this);

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

  static destroyAllSprites() {
    if (Enemy.allEnemies) {
      Enemy.allEnemies.forEach(function(enemy) {
        if (enemy.sprite) {
          enemy.sprite.destroy();
        }
      });
    }
  };

  collision(bodyA, bodyB) {
    if (bodyA.parent.gameObject && bodyB.parent.gameObject) {
      if (bodyA.parent.gameObject.wrapper && bodyB.parent.gameObject.wrapper) {
        let enemy = bodyA.parent.gameObject.wrapper;
        let bullet = bodyB.parent.gameObject.wrapper;

        if ((enemy instanceof Enemy) && (bullet instanceof Bullet)) {
          bullet.owner.scoreEvent('destroy_enemy');
          bullet.destroy();
          enemy.destroy();
        }
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
  };
}
export default Enemy;
