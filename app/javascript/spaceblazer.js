import * as devicesChannel from 'devices_channel';
import * as gamesChannel from 'games_channel';

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
    this.state = {};
    this.debug = true;
    this.devicesChannel = devicesChannel;
    this.gamesChannel = gamesChannel;
    this.assetPath = assetPath();

    this.starScene = StarScene;
    this.mainScene = MainScene;
    StarScene.spaceblazer = this;
    MainScene.spaceblazer = this;

    this.addFullscreenEvent();

    config.reset = false;
  }

  static newGame() {
    Cable.send('new_game', { id: game.fingerprint });
  }

  static fetchGame() {
    Cable.send('fetch_game', { id: game.fingerprint });
  }

  static finishGame() {
    Cable.send('finish_game', { id: game.fingerprint });
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
