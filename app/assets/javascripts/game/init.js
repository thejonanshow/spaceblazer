//= require cable
//= require fingerprint2
//= require_tree .
//= require_self

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
  scene: [MainScene, EndScene],
  audio: {
    disableWebAudio: true
  }
};

let game = new Phaser.Game(gameConfig);
let debug = false;
let scene = {};
let players = {};
let enemies = {};
let bullets = {};

new Fingerprint2().get(function(result, components) {
  console.log("Fingerprint: " + result);
  let cable_url = document.head.querySelector("[name~=action-cable-url][content]").content

  this.App = {};
  App.cable = ActionCable.createConsumer(cable_url + "/?uid=" + result);

  App.commands = App.cable.subscriptions.create('CommandsChannel', {
    received: function(data) {
      handle_command(data);
    }
  });
})
