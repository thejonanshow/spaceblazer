function preload(){
  scene = this;
  load_player_avatars();
  load_enemy_avatars();
};

function create(){
  create_players();
  create_enemies();
};

function update(){
};
