let player_avatars = {
  astro_blue: {
    frames: [],
    filename: 'astro/blue/blue_astro'
  },
  astro_green: {
    frames: [],
    filename: 'astro/green/green_astro'
  },
  astro_yellow: {
    frames: [],
    filename: 'astro/yellow/yellow_astro'
  },
  astro_orange: {
    frames: [],
    filename: 'astro/orange/orange_astro'
  },
  astro_red: {
    frames: [],
    filename: 'astro/red/red_astro'
  },
  astro_purple: {
    frames: [],
    filename: 'astro/purple/purple_astro'
  },
};
let player_avatar_keys = Object.keys(player_avatars);
let available_avatars = Object.keys(player_avatars);
let used_avatars = [];

function fire(player){
};

function create_players() {
  players = scene.physics.add.group();
  create_player_animations();
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

function load_player_avatars() {
  scene.load.path = 'https://s3-us-west-1.amazonaws.com/spaceblazer/players/';

  player_avatar_keys.forEach(function(avatar_key) {
    for (i of range(1, 6)) {
      frame_key = avatar_key + i;
      player_avatars[avatar_key].frames.push({ key: frame_key });
      scene.load.image(frame_key, player_avatars[avatar_key].filename + i + '.png');
    };
  });
};

function create_player_animations() {
  player_avatar_keys.forEach(function(avatar_key) {
    scene.anims.create({
      key: avatar_key,
      frames: player_avatars[avatar_key].frames,
      frameRate: 8,
      repeat: -1
    });
  });
};
