function hit_enemy() {
  console.log("BOOM");
};

class Enemy {
  constructor() {
    this.avatar = 'server';
    this.sprite = enemies.create(700, 300, this.avatar + '1');
    this.sprite.play(this.avatar);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.wrapper = this;

    this.bullet = 'floppy';
  };

  static load_animations(scene) {
    scene.load.animation('server', 'animations/enemies/server.json');
    scene.load.animation('server_explosion', 'animations/explosions/server/explosion.json'); 
    scene.load.animation('floppy', 'animations/bullets/floppy.json');
  };

  static load() {
    bullets = scene.physics.add.group();
    enemies = scene.physics.add.group();
    scene.physics.add.collider(players, enemies, hit_enemy, null, scene);
  };

  fire() {
    let bullet = bullets.create(this.sprite.x - 30, this.sprite.y, this.bullet + '1');
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

Enemy.avatars = {
  server: {
    frames: [],
    path: 'enemies/server/server',
    frame_count: 2,
    frame_rate: 2,
    repeat: -1
  }
};

Enemy.explosions = {
  explosion: {
    frames: [],
    path: 'explosions/server/explosion',
    frame_count: 3,
    frame_rate: 10,
    repeat: 0
  }
};

Enemy.bullets = {
  floppy: {
    frames: [],
    path: 'bullets/floppy/floppy',
    frame_count: 2,
    frame_rate: 4,
    repeat: -1
  }
};
