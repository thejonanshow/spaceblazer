let player_avatars = {
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
let available_avatars = Object.keys(player_avatars);
let used_avatars = [];

function fire(player){
};

function new_player(id) {
  let avatar_key = available_avatars[Math.floor(Math.random() * available_avatars.length)];
  available_avatars.remove(avatar_key);
  used_avatars.push(avatar_key);

  let player = players.create(400, 300, avatar_key + '1');
  player.play(avatar_key);
  player.setCollideWorldBounds(true);

  players[id] = { avatar: avatar_key, score: 0, sprite: player }
};

function load_player_bullets() {
};

class Player {
  static preload() {
    load_animations(player_avatars);
  };

  static load() {
    players = scene.physics.add.group();
    create_animations(player_avatars);
  };
};
