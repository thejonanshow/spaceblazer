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
let debug = false;
let scene = {};
let players = {};
let enemies = {};
let bullets = {};

this.App = {};
App.cable = ActionCable.createConsumer();

App.commands = App.cable.subscriptions.create('CommandsChannel', {
  received: function(data) {
    handle_command(data);
  }
});
