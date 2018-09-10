let enemy_avatars = {
  server: {
    frames: [],
    path: 'enemies/server/server',
    frame_count: 2,
    frame_rate: 2
  }
};

let enemy_bullets = {
  floppy: {
    frames: [],
    path: 'bullets/floppy/floppy',
    frame_count: 2,
    frame_rate: 4
  }
};

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

function setup_enemies() {
  load_animations(enemy_avatars);
  load_animations(enemy_bullets);
};

function create_enemy_animations() {
  create_animations(enemy_avatars);
  create_animations(enemy_bullets);
};

function hit_enemy() {
  console.log("BOOM");
};
