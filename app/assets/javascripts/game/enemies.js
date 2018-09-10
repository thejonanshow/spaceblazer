let enemy_avatars = {
  server: {
    frames: [],
    filename: 'server/server'
  }
};
let enemy_avatar_keys = Object.keys(enemy_avatars);

function new_enemy() {
  let avatar_key = 'server';
  let enemy = enemies.create(700, 300, avatar_key + '1');
  enemy.play(avatar_key);
  enemy.setCollideWorldBounds(true);
};

function create_enemies() {
  enemies = scene.physics.add.group();
  scene.physics.add.collider(players, enemies, hit_enemy, null, scene);
  create_enemy_animations();
};

function load_enemy_avatars() {
  scene.load.path = 'https://s3-us-west-1.amazonaws.com/spaceblazer/enemies/';

  enemy_avatar_keys.forEach(function(avatar_key) {
    for (i of range(1, 2)) {
      frame_key = avatar_key + i;
      enemy_avatars[avatar_key].frames.push({ key: frame_key });
      scene.load.image(frame_key, enemy_avatars[avatar_key].filename + i + '.png');
    };
  });
};

function create_enemy_animations() {
  enemy_avatar_keys.forEach(function(avatar_key) {
    scene.anims.create({
      key: avatar_key,
      frames: enemy_avatars[avatar_key].frames,
      frameRate: 2,
      repeat: -1
    });
  });
};

function hit_enemy() {
  console.log("BOOM");
};
