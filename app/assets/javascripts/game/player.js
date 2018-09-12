class Player {
  constructor(id) {
    this.avatar = 'astro_blue';
    this.sprite = players.create(400, 300, this.avatar + '1');
    this.sprite.play(this.avatar);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.wrapper = this;

    this.bullet = 'rainbow_bomb';

    Player.active_players[id] = this;
  };

  static preload() {
  };

  static load() {
    players = scene.physics.add.group();
    bullets = scene.physics.add.group();
  };

  move_up() {
    this.sprite.setVelocityY(-Player.speed);
  };

  move_down() {
    this.sprite.setVelocityY(Player.speed);
  };

  move_left() {
    this.sprite.setVelocityX(-Player.speed);
  };

  move_right() {
    this.sprite.setVelocityX(Player.speed);
  };

  stop() {
    this.sprite.setVelocityX(0);
    this.sprite.setVelocityY(0);
  };

  stop_x() {
    this.sprite.setVelocityX(0);
  };

  stop_y() {
    this.sprite.setVelocityY(0);
  };

  fire() {
    let bullet = bullets.create(this.sprite.x + 50, this.sprite.y + 20, this.bullet + '1');
    scene.physics.add.collider(bullet, enemies, this.bullet_strike, null, scene);
    bullet.play(this.bullet);
    bullet.setVelocityX(Player.bullets[this.bullet].speed);
  };

  bullet_strike(bullet, enemy) {
    enemy.wrapper.die();
    bullet.destroy();
  };
};

Player.bullets = {
  rainbow_bomb: {
    frames: [],
    path: 'bullets/rainbow_bomb/rainbow_bomb',
    frame_count: 12,
    frame_rate: 200,
    repeat: -1,
    speed: 400
  }
};

Player.active_players = {};
Player.speed = 200;
