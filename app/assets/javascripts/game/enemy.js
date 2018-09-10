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

  static preload() {
    load_animations(this.avatars);
    load_animations(this.bullets);
    load_animations(this.explosions);
  };

  static load() {
    enemies = scene.physics.add.group();
    scene.physics.add.collider(players, enemies, hit_enemy, null, scene);

    create_animations(this.avatars);
    create_animations(this.bullets);
    create_animations(this.explosions);
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
    this.sprite.destroy();
    let explosion = scene.add.sprite(this.sprite.x, this.sprite.y, 'explosion1');
    explosion.on('animationcomplete', function() { explosion.destroy(); });
    explosion.play('explosion');
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
