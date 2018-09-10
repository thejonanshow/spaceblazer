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

function hit_enemy() {
  console.log("BOOM");
};

class Enemy {
  static preload() {
    load_animations(enemy_avatars);
    load_animations(enemy_bullets);
  };

  static load() {
    enemies = scene.physics.add.group();
    scene.physics.add.collider(players, enemies, hit_enemy, null, scene);
    create_animations(enemy_avatars);
    create_animations(enemy_bullets);
  };
};
