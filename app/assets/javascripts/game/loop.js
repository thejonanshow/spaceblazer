function preload(){
  scene = this;
  Player.preload();
  Enemy.preload()
  this.load.audio('theme', ['audio/neoishiki.mp3']);
};

function create(){
  Player.load();
  Enemy.load();

  let music = this.sound.add('theme');
  // music.play();
};

function update(){
};
