function hitEnemy(player, enemy) {
  player.wrapper.mayday();
};

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

    this.avatar = 'server';
    this.spawn = Enemy.getSpawnPoint();
    this.bullets = [];
    this.direction = Enemy.directions[Math.floor(Math.random() * Enemy.directions.length)];

    this.sprite = Enemy.enemies.create(this.spawn.x, this.spawn.y, this.avatar + '1');
    debugLog("New enemy in scene " + scene.name + ' with ID ' + this.id);

    this.sprite.play(this.avatar);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.wrapper = this;

    this.bullet = 'floppy';

    Enemy.activeEnemies[this.id] = this;

    if (this.started) this.startMoving();
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
    let spawnPoint = { x: Enemy.spawnOffset.x - (Enemy.width() / 2), y: Enemy.spawnOffset.y + (Enemy.height() / 2) };

    debugLog('Enemy spawn: ' + JSON.stringify(spawnPoint));

    if (screen.height > (spawn_point.y + (Enemy.height() * 2) + 50)) {
      Enemy.spawnOffset.y += (Enemy.height() + 10);
    }
    else if (screen.availWidth > (spawn_point.x - (Enemy.width() + 10))) {
      Enemy.spawnOffset.x -= (Enemy.width() + 10);
      Enemy.spawnOffset.y = 10;
    }
    else {
      Enemy.spawnOffset = { x: (screen.width - 10), y: 10 };
    }

    return spawnPoint;;
  };

  static load(currentScene) {
    Enemy.bullets = currentScene.physics.add.group();
    Enemy.enemies = currentScene.physics.add.group();
    currentScene.physics.add.collider(Player.players, Enemy.enemies, hitEnemy, null, currentScene);

    currentScene.load.animation('server', 'animations/enemies/server.json');
    currentScene.load.animation('server_explosion', 'animations/explosions/server/explosion.json'); 
    currentScene.load.animation('floppy', 'animations/bullets/floppy.json');
  };

  static update(currentScene) {
    if (currentScene.started) {
      Object.values(Enemy.activeEnemies).forEach(function(enemy) {
        if (enemy != null) {
          enemy.fire(currentScene);
          enemy.changeDirection();
          enemy.cleanup();
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
                new Enemy(deaadEnemyId, currentScene);
              }
            }
          }
        }
      });
    }
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

  changeDirection() {
    if (this.sprite.x < (this.sprite.width / 2)) {
      if (this.direction == "NW") {
        this.direction = "NE";
      }
      else {
        this.direction = "SE";
      }
    }
    else if (this.sprite.y < (this.sprite.height / 2)) {
      if (this.direction == "NE") {
        this.direction = "SE";
      }
      else {
        this.direction = "SW";
      }
    }
    else if (this.sprite.x > (screen.availWidth - (this.sprite.width / 2))) {
      if (this.direction == "NE") {
        this.direction = "NW";
      }
      else {
        this.direction = "SW";
      }
    }
    else if (this.sprite.y > (screen.height - (this.sprite.height))) {
      if (this.direction == "SE") {
        this.direction = "NE";
      }
      else {
        this.direction = "NW";
      }
    }

    stop(this);
    this.startMoving();
  };

  cleanupBullets() {
    let enemy = this;

    enemy.bullets.forEach(function(bullet) {
      if ((bullet.x < 0) || (bullet.active == false)) {
        bullet.destroy();
        enemy.bullets.remove(bullet);
      }
    });
  };

  cleanup() {
    this.cleanupBullets();
  };

  fire() {
    if (this.bullets.length > 0) {
      return;
    }

    let bullet = Enemy.bullets.create(this.sprite.x - 30, this.sprite.y, this.bullet + '1');
    this.scene.physics.add.collider(bullet, Player.players, this.bulletStrike, null, this.scene);
    this.bullets.push(bullet);
    bullet.play(this.bullet);
    bullet.setVelocityX(-Enemy.bulletSpeed);
  };

  bulletStrike(bullet, player) {
    player.wrapper.mayday();
    bullet.destroy();
  };

  die() {
    let explosion = this.scene.add.sprite(this.sprite.x, this.sprite.y, 'animations/explosions/server/explosion1');
    explosion.play('server_explosion');
    this.sprite.destroy();
    Enemy.activeEnemies[this.id] = null;
    Enemy.deadEnemies[this.scene.sys.time.now] = this.id;
  };
};
Enemy.speed = 100;
Enemy.activeEnemies = {};
Enemy.deadEnemies = {};
Enemy.spawnOffset = { x: (screen.width - 10), y: 10 };
Enemy.bulletSpeed = 500;
Enemy.directions = ["NE", "SE", "SW", "NW"]
