const gameConfig = {
  type: Phaser.AUTO,
  width: screen.width,
  height: screen.height,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let game = new Phaser.Game(gameConfig);
let players = {};

let avatars = {
  astro_yellow: {
    frames: []
  }
};

let available_avatars = Object.keys(avatars);
let used_avatars = [];

function preload(){
  this.load.path = 'https://s3-us-west-1.amazonaws.com/spaceblazer/players/';
  
  for (i of range(1, 6)) {
    key = 'astro_yellow' + i;
    avatars.astro_yellow.frames.push({ key: key });
    this.load.image(key, 'astro/yellow/yellow_astro' + i + '.png');
  };
}

let thees = 5;

function create(){
  let phaser = this;
  let avatar_keys = Object.keys(avatars);

  avatar_keys.forEach(function(key) {
    phaser.anims.create({
      key: key,
      frames: avatars[key].frames,
      frameRate: 8,
      repeat: -1
    });
  });

  this.add.sprite(400, 300, 'astro_yellow1').play('astro_yellow');
};

function update(){
};

function fire(){
};

function moveUp(){
  player.setVelocityY(-100);
};

function moveDown(){
  player.setVelocityY(100);
};

function moveLeft(){
  player.setVelocityX(-100);
};

function moveRight(){
  player.setVelocityX(100);
};

function stop(){
  player.setVelocityX(0);
  player.setVelocityY(0);
};

function stopX(){
  player.setVelocityX(0);
};

function stopY(){
  player.setVelocityY(0);
};
