function hit_enemy() {
  console.log("BOOM");
};

class Enemy {
  constructor() {
    this.avatar = 'server';
    this.sprite = Enemy.enemies.create(700, 300, this.avatar + '1');
    this.sprite.play(this.avatar);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.wrapper = this;

    this.bullet = 'floppy';
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
