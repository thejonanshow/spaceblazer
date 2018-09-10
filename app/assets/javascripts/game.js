//= require cable
//= require_self
//= require_tree .

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

let phaser = {};
function create(){
  phaser = this;
  let avatar_keys = Object.keys(avatars);

  avatar_keys.forEach(function(key) {
    phaser.anims.create({
      key: key,
      frames: avatars[key].frames,
      frameRate: 8,
      repeat: -1
    });
  });
};

function update(){
};

function fire(player){
};

function moveUp(player){
  player.setVelocityY(-100);
};

function moveDown(player){
  player.setVelocityY(100);
};

function moveLeft(player){
  player.setVelocityX(-100);
};

function moveRight(player){
  player.setVelocityX(100);
};

function stop(player){
  player.setVelocityX(0);
  player.setVelocityY(0);
};

function stopX(player){
  player.setVelocityX(0);
};

function stopY(player){
  player.setVelocityY(0);
};

this.App = {};
App.cable = ActionCable.createConsumer();

App.commands = App.cable.subscriptions.create('CommandsChannel', {
  received: function(data) {
    handle_command(data);
  }
});

function new_player(id) {
  let avatar_key = available_avatars[Math.floor(Math.random() * available_avatars.length)];
  available_avatars.remove(avatar_key);
  used_avatars.push(avatar_key);

  let sprite = phaser.add.sprite(400, 300, 'astro_yellow1').play('astro_yellow');

  players[id] = { avatar: avatar_key, score: 0, sprite: sprite }
};

function handle_command(data) {
  let parsed = JSON.parse(data);
  let id = parsed.id;
  let command = parsed.command;

  if (!players[id]) {
    new_player(id);
  }

  let sprite = players[id];

  if (command == 'online') {
  }
  else if (command == 'u') {
    moveUp(sprite);
  }
  else if (command == 'd') {
    moveDown(sprite);
  }
  else if (command == 'l') {
    moveLeft(sprite);
  }
  else if (command == 'r') {
    moveRight(sprite);
  }
  else if (command == '9' || command == '0') {
    stopY(sprite);
  }
  else if (command == 'k' || command == 'e') {
    stopX(sprite);
  }
  else if (command == 'b') {
    fire(sprite);
  }
};
