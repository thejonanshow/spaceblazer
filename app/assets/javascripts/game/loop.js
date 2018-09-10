function preload(){
  scene = this;
  Player.preload();
  Enemy.preload()
};

function create(){
  Player.load();
  Enemy.load();
};

function update(){
};
