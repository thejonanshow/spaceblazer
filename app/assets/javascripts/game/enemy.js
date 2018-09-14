function hit_enemy() {
  console.log("BOOM");
};

class Enemy {
  constructor() {
    this.avatar = 'server';
    this.spawn = Enemy.get_spawn_point();

    this.sprite = Enemy.enemies.create(this.spawn.x, this.spawn.y, this.avatar + '1');
    this.sprite.play(this.avatar);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.wrapper = this;

    this.bullet = 'floppy';
  };

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

  static load() {
    Enemy.bullets = scene.physics.add.group();
    Enemy.enemies = scene.physics.add.group();
    scene.physics.add.collider(Player.players, Enemy.enemies, hit_enemy, null, scene);

    scene.load.animation('server', 'animations/enemies/server.json');
    scene.load.animation('server_explosion', 'animations/explosions/server/explosion.json'); 
    scene.load.animation('floppy', 'animations/bullets/floppy.json');
  };

  fire() {
    let bullet = Enemy.bullets.create(this.sprite.x - 30, this.sprite.y, this.bullet + '1');
    scene.physics.add.collider(bullet, players, this.bullet_strike, null, scene);
    bullet.play(this.bullet);
    bullet.setVelocityX(Enemy.bullets[this.bullet].speed);
  };

  bullet_strike(bullet, player) {
    bullet.destroy();
  };

  die() {
    let explosion = scene.add.sprite(this.sprite.x, this.sprite.y, 'animations/explosions/server/explosion1');
    explosion.play('server_explosion');
    this.sprite.destroy();
  };
};
Enemy.spawn_offset = { x: (screen.width - 10), y: 10 };
