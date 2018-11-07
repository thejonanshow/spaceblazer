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

    this.devicesSubscription = this.devicesChannel.subscribe(this);
    this.gamesSubscription = this.gamesChannel.subscribe(this);
    this.commandsChannel.subscribe(this);

    return Spaceblazer.current;
  }

  static fetchGame() {
    Spaceblazer.current.fetchGame();
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

  static createPlayer(data) {
    Player.create(data, this.current.mainScene);
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
