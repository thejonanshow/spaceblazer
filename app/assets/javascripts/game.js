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

const playerSpeed = 200;

let avatars = {
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
let avatar_keys = Object.keys(avatars);

let available_avatars = Object.keys(avatars);
let used_avatars = [];

function preload(){
  this.load.path = 'https://s3-us-west-1.amazonaws.com/spaceblazer/players/';
  let dis = this;
  
  avatar_keys.forEach(function(avatar_key) {
    for (i of range(1, 6)) {
      frame_key = avatar_key + i;
      avatars[avatar_key].frames.push({ key: frame_key });
      dis.load.image(frame_key, avatars[avatar_key].filename + i + '.png');
    };
  });
};

let phaser = {};
function create(){
  phaser = this;

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
  player.setVelocityY(-playerSpeed);
};

function moveDown(player){
  player.setVelocityY(playerSpeed);
};

function moveLeft(player){
  player.setVelocityX(-playerSpeed);
};

function moveRight(player){
  player.setVelocityX(playerSpeed);
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

  let sprite = phaser.physics.add.sprite(400, 300, avatar_key + '1');
  sprite.play(avatar_key);
  sprite.setCollideWorldBounds(true);

  players[id] = { avatar: avatar_key, score: 0, sprite: sprite }
};

function handle_command(data) {
  let parsed = JSON.parse(data);
  let id = parsed.id;
  let command = parsed.command;
  console.log(command);

  if (!players[id]) {
    new_player(id);
  }

  let sprite = players[id].sprite;

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
  else if (command == '-' || command == '=') {
    stopX(sprite);
  }
  else if (command == 'b') {
    fire(sprite);
  }
};
