class Player {
  constructor(id) {
    this.avatar = Player.available_avatars[Math.floor(Math.random() * Player.available_avatars.length)];
    Player.available_avatars.remove(this.avatar);

    let sprite = players.create(400, 300, this.avatar + '1');
    sprite.play(this.avatar);
    sprite.setCollideWorldBounds(true);

    this.sprite = sprite;

    Player.active_players[id] = this
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

  static preload() {
    load_animations(this.avatars);
  };

  static load() {
    players = scene.physics.add.group();
    create_animations(this.avatars);
  };
};

Player.avatars = {
  astro_blue: {
    frames: [],
    path: 'players/astro/blue/blue_astro',
    frame_count: 6,
    frame_rate: 8
  },
  astro_green: {
    frames: [],
    path: 'players/astro/green/green_astro',
    frame_count: 6,
    frame_rate: 8
  },
  astro_yellow: {
    frames: [],
    path: 'players/astro/yellow/yellow_astro',
    frame_count: 6,
    frame_rate: 8
  },
  astro_orange: {
    frames: [],
    path: 'players/astro/orange/orange_astro',
    frame_count: 6,
    frame_rate: 8
  },
  astro_red: {
    frames: [],
    path: 'players/astro/red/red_astro',
    frame_count: 6,
    frame_rate: 8
  },
  astro_purple: {
    frames: [],
    path: 'players/astro/purple/purple_astro',
    frame_count: 6,
    frame_rate: 8
  },
};
Player.available_avatars = Object.keys(Player.avatars);
Player.used_avatars = [];
Player.active_players = {};

Player.speed = 200;
