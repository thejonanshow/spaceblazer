import DevicesChannel from 'devices_channel';
import GamesChannel from 'games_channel';

import Phaser from 'phaser';

import { range } from 'helpers/range';
import { remove } from 'helpers/remove';
Array.prototype.remove = remove;
import { sample } from 'helpers/sample';
Array.prototype.sample = sample;
import { assetPath } from 'helpers/asset_path';

import { handleCommand } from 'game/command_handler';
import { echoCommand, addKeyboardControls } from 'game/keyboard';
import { moveUp, moveDown, moveLeft, moveRight, stop, stopX, stopY } from 'game/movement';
import { addSfxMarkers } from 'game/sfx';

import Enemy from 'game/enemy'
import Player from 'game/player'
import Bullet from 'game/bullet'

import StarScene from 'game/scenes/star'
import MainScene from 'game/scenes/main'

import config from 'game/config';

class Spaceblazer {
  constructor() {
    if (!Spaceblazer.current) {
      Spaceblazer.current = this;
    }

    this.state = {};
    this.debug = true;
    this.devicesChannel = new DevicesChannel;
    this.gamesChannel = new GamesChannel;
    this.assetPath = assetPath();

    this.starScene = StarScene;
    this.mainScene = MainScene;
    StarScene.spaceblazer = this;
    MainScene.spaceblazer = this;

    this.addFullscreenEvent();

    config.reset = false;

    this.devicesSubscription = this.devicesChannel.connect(
      this,
      this.devicesConnected,
      this.devicesReceived,
      this.devicesDisconnected
    )
    this.gamesSubscription = this.gamesChannel.connect(
      this,
      this.gamesConnected,
      this.gamesReceived,
      this.gamesDisconnected
    );

    return Spaceblazer.current;
  }

  static fetchGame() {
    Spaceblazer.current.fetchGame();
  }

  fetchGame() {
    if (this.gamesSubscription) {
      this.gamesSubscription.perform('fetch_game', { device_id: this.id });
    }
  }

  finishGame() {
    if (this.gamesSubscription) {
      this.gamesSubscription.perform('finish_game', {
        device_id: this.id,
        game_data: {
          finishing_device: this.id
        }
      });
    }
  }

  static init() {
    Player.init();
    Enemy.init();
    Bullet.init();
  }

  static destroySprites() {
    Player.destroyAllSprites();
    Enemy.destroyAllSprites();
    Bullet.destroyAllSprites();
  }

  static restart() {
    config.first_game = false;
    game.mainScene.reset();
    game.mainScene.scene.stop();
    Spaceblazer.destroySprites();
    game.mainScene.scene.restart();
    Spaceblazer.init();
  }

  devicesConnected(data) {
    console.log("Spaceblazer#devicesConnected: " + JSON.stringify(data));
  }
  devicesReceived(data) {
    console.log("Spaceblazer#devicesReceived: " + JSON.stringify(data));
  }
  devicesDisconnected(data) {
    console.log(data);
    console.log("Spaceblazer#devicesDisconnected: " + JSON.stringify(data));
  }
  gamesConnected(data) {
    console.log(data);
    console.log("Spaceblazer#gamesConnected: " + JSON.stringify(data));
  }
  gamesReceived(data) {
    console.log(data);
    console.log("Spaceblazer#gamesReceived: " + JSON.stringify(data));
  }
  gamesDisconnected(data) {
    console.log(data);
    console.log("Spaceblazer#gamesDisconnected: " + JSON.stringify(data));
  }

  addFullscreenEvent() {
    document.addEventListener("load", ()=> {
      let gameCanvas = document.getElementsByTagName('canvas')[0];

      gameCanvas.addEventListener("click", ( event )=> {
        screenfull.toggle(this);
      }, false);
    });
  }

  debugLog(message) {
    if (this.debug) {
      console.log(message);
    };
  }
}
export default Spaceblazer;
