var frameNames;
const MainScene = new Phaser.Class({
  Extends: Phaser.Scene,
  active: false,
  initialize: function MainScene () {
    Phaser.Scene.call(this, { key: 'main' });
  },

  preload: function () {
    console.log("Main preload");
    this.load.path = 'https://s3-us-west-1.amazonaws.com/spaceblazer/';

    scene = this;
    Player.preload();
    Enemy.preload()

    this.load.multiatlas('multipass');

	scene = this
    names = ['appy', 'blaze', 'cloudy', 'codey', 'earnie', 'einstein', 'hootie', 'koa', 'astro']
	names.forEach(function(name) {
	  scene.load.animation(name, 'animations/players/' + name + '.json'); 
    });

    this.load.animation('server', 'animations/enemies/server.json');
    this.load.animation('server_explosion', 'animations/explosions/server/explosion.json'); 
    this.load.animation('floppy', 'animations/bullets/floppy.json');
    this.load.animation('rainbow_bomb', 'animations/bullets/rainbow_bomb.json');

    this.load.audio('theme', ['audio/neoishiki.mp3']);
  },

  create: function () {
    Player.load();
    Enemy.load();

    // let music = this.sound.add('theme');
    // music.play();
  },

  update: function () {
  }
});
