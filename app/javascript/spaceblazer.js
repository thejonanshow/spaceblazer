import ConsoleLogger from 'game/console_logger';

import DevicesChannel from 'devices_channel';
import GamesChannel from 'games_channel';
import CommandsChannel from 'commands_channel';

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
    this.debug = false;

    this.devicesChannel = new DevicesChannel;
    this.gamesChannel = new GamesChannel;
    this.commandsChannel = new CommandsChannel;

    this.assetPath = assetPath();

    this.starScene = StarScene;
    this.mainScene = MainScene;

    StarScene.spaceblazer = this;
    MainScene.spaceblazer = this;

    this.addFullscreenEvent();

    config.reset = false;

    this.devicesSubscription = this.devicesChannel.subscribe(
      this,
      this.devicesConnected,
      this.devicesReceived,
      this.devicesDisconnected
    )
    this.gamesSubscription = this.gamesChannel.subscribe(
      this,
      this.gamesConnected,
      this.gamesReceived,
      this.gamesDisconnected
    );
    this.commandsChannel.subscribe(
      this,
      this.commandsConnected,
      this.commandsReceived,
      this.commandsDisconnected
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
    ConsoleLogger.debug("Device " + Spaceblazer.current.id + " connected to device channel.");
  }
  devicesReceived(data) {
    ConsoleLogger.debug("Device " + Spaceblazer.current.id + " received data on device channel: " + JSON.stringify(data));
  }
  devicesDisconnected(data) {
    ConsoleLogger.debug("Device " + Spaceblazer.current.id + " disconnected from device channel.");
  }
  gamesConnected(data) {
    ConsoleLogger.debug("Device " + Spaceblazer.current.id + " connected to game channel.");
  }
  gamesReceived(data) {
    ConsoleLogger.debug("Device " + Spaceblazer.current.id + " received data on game channel: " + JSON.stringify(data));
  }
  gamesDisconnected(data) {
    ConsoleLogger.debug("Device " + Spaceblazer.current.id + " disconnected from game channel.");
  }
  commandsConnected(data) {
    ConsoleLogger.debug("Device " + Spaceblazer.current.id + " connected to command channel.");
  }
  commandsReceived(data) {
    handleCommand(data);
    ConsoleLogger.debug("Device " + Spaceblazer.current.id + " received data on command channel: " + JSON.stringify(data));
  }
  commandsDisconnected(data) {
    ConsoleLogger.debug("Device " + Spaceblazer.current.id + " disconnected from command channel.");
  }

  addFullscreenEvent() {
    document.addEventListener("load", ()=> {
      let gameCanvas = document.getElementsByTagName('canvas')[0];

      gameCanvas.addEventListener("click", ( event )=> {
        screenfull.toggle(this);
      }, false);
    });
  }
}
export default Spaceblazer;
