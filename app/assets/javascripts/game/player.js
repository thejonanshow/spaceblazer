class Player {
  constructor(id) {
    this.avatar = Player.available_avatars[Math.floor(Math.random() * Player.available_avatars.length)];
    Player.available_avatars.remove(this.avatar);

    this.sprite = players.create(400, 300, this.avatar + '1');
    this.sprite.play(this.avatar);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.wrapper = this;

    this.bullet = 'rainbow_bomb';

    Player.active_players[id] = this;
  };

  static preload() {
    load_animations(this.avatars);
    load_animations(this.bullets);
  };

  static load() {
    players = scene.physics.add.group();
    bullets = scene.physics.add.group();

    create_animations(this.avatars);
    create_animations(this.bullets);
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

Player.avatars = {
  astro_blue: {
    frames: [],
    path: 'players/astro/blue/blue_astro',
    frame_count: 6,
    frame_rate: 8,
    repeat: -1
  },
  astro_green: {
    frames: [],
    path: 'players/astro/green/green_astro',
    frame_count: 6,
    frame_rate: 8,
    repeat: -1
  },
  astro_yellow: {
    frames: [],
    path: 'players/astro/yellow/yellow_astro',
    frame_count: 6,
    frame_rate: 8,
    repeat: -1
  },
  astro_orange: {
    frames: [],
    path: 'players/astro/orange/orange_astro',
    frame_count: 6,
    frame_rate: 8,
    repeat: -1
  },
  astro_red: {
    frames: [],
    path: 'players/astro/red/red_astro',
    frame_count: 6,
    frame_rate: 8,
    repeat: -1
  },
  astro_purple: {
    frames: [],
    path: 'players/astro/purple/purple_astro',
    frame_count: 6,
    frame_rate: 8,
    repeat: -1
  },
};
Player.available_avatars = Object.keys(Player.avatars);
Player.used_avatars = [];

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
