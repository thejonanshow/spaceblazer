function hit_enemy(player, enemy) {
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
      console.log("Revived " + id);
      this.id = id;
    }

    this.avatar = 'server';
    this.spawn = Enemy.get_spawn_point();
    this.bullets = [];
    this.direction = Enemy.directions[Math.floor(Math.random() * Enemy.directions.length)];

    this.sprite = Enemy.enemies.create(this.spawn.x, this.spawn.y, this.avatar + '1');
    console.log("New enemy in scene " + scene.name + ' with ID ' + this.id);

    this.sprite.play(this.avatar);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.wrapper = this;

    this.bullet = 'floppy';

    Enemy.active_enemies[this.id] = this;

    if (this.started) this.start_moving();
  };

  static generateId() {
    return ("enemy" + (Object.keys(Enemy.active_enemies).length + 1));
  }

  static width() {
    return 105;
  };

  static height() {
    return 167;
  };

  static get_spawn_point() {
    let spawn_point = { x: Enemy.spawn_offset.x - (Enemy.width() / 2), y: Enemy.spawn_offset.y + (Enemy.height() / 2) };
    console.log('Enemy spawn: ' + JSON.stringify(spawn_point));

    if (screen.height > (spawn_point.y + (Enemy.height() * 2) + 50)) {
      Enemy.spawn_offset.y += (Enemy.height() + 10);
    }
    else if (screen.availWidth > (spawn_point.x - (Enemy.width() + 10))) {
      Enemy.spawn_offset.x -= (Enemy.width() + 10);
      Enemy.spawn_offset.y = 10;
    }
    else {
      Enemy.spawn_offset = { x: (screen.width - 10), y: 10 };
    }

    return spawn_point;
  };

  static load(currentScene) {
    Enemy.bullets = currentScene.physics.add.group();
    Enemy.enemies = currentScene.physics.add.group();
    currentScene.physics.add.collider(Player.players, Enemy.enemies, hit_enemy, null, currentScene);

    currentScene.load.animation('server', 'animations/enemies/server.json');
    currentScene.load.animation('server_explosion', 'animations/explosions/server/explosion.json'); 
    currentScene.load.animation('floppy', 'animations/bullets/floppy.json');
  };

  static update(currentScene) {
    if (currentScene.started) {
      Object.values(Enemy.active_enemies).forEach(function(enemy) {
        if (enemy != null) {
          enemy.fire(currentScene);
          enemy.change_direction();
          enemy.cleanup();
        }
      });

      let time_now = currentScene.time.now;
      const ENEMY_RESWPAWN_DELAY_MS = 3000;
      Object.keys(Enemy.dead_enemies).forEach(function(time_of_death) {
        if (time_of_death != null) {
          if ((time_now - time_of_death) > ENEMY_RESWPAWN_DELAY_MS) {
            let dead_enemy_id = Enemy.dead_enemies[time_of_death]

            if (Enemy.active_enemies[dead_enemy_id] == null) {
              if (dead_enemy_id != null) {
                console.log("Reviving dead enemy: " + dead_enemy_id);
                Enemy.dead_enemies[time_of_death] = null;
                new Enemy(dead_enemy_id, currentScene);
              }
            }
          }
        }
      });
    }
  };

  start_moving() {
    if (this.direction == "NE") {
      move_up(this);
      move_right(this);
    }
    else if (this.direction == "SE") {
      move_down(this);
      move_right(this);
    }
    else if (this.direction == "SW") {
      move_down(this);
      move_left(this);
    }
    else if (this.direction == "NW") {
      move_up(this);
      move_left(this);
    }
  };

  change_direction() {
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
    this.start_moving();
  };

  cleanup_bullets() {
    let enemy = this;

    enemy.bullets.forEach(function(bullet) {
      if ((bullet.x < 0) || (bullet.active == false)) {
        bullet.destroy();
        enemy.bullets.remove(bullet);
      }
    });
  };

  cleanup() {
    this.cleanup_bullets();
  };

  fire() {
    if (this.bullets.length > 0) {
      return;
    }

    // let player_ids = Object.keys(Player.active_players);
    // let target_id = player_ids[Math.floor(Math.random() * player_ids.length)];
	// let target = Player.active_players[target_id];

	// let path = this.add.path(this.sprite.x, this.sprite.y);
	// path.lineTo(target.sprite.x, target.sprite.y);

    let bullet = Enemy.bullets.create(this.sprite.x - 30, this.sprite.y, this.bullet + '1');
    this.scene.physics.add.collider(bullet, Player.players, this.bullet_strike, null, this.scene);
    this.bullets.push(bullet);
    bullet.play(this.bullet);
    bullet.setVelocityX(-Enemy.bullet_speed);
  };

  bullet_strike(bullet, player) {
    player.wrapper.mayday();
    bullet.destroy();
  };

  die() {
    let explosion = this.scene.add.sprite(this.sprite.x, this.sprite.y, 'animations/explosions/server/explosion1');
    explosion.play('server_explosion');
    this.sprite.destroy();
    Enemy.active_enemies[this.id] = null;
    Enemy.dead_enemies[this.scene.sys.time.now] = this.id;
  };
};
Enemy.speed = 100;
Enemy.active_enemies = {};
Enemy.dead_enemies = {};
Enemy.spawn_offset = { x: (screen.width - 10), y: 10 };
Enemy.bullet_speed = 500;
Enemy.directions = ["NE", "SE", "SW", "NW"]
