class Player {
  constructor(id) {
    this.avatar = 'astro_blue';
    this.sprite = players.create(400, 300, this.avatar + '1');
    this.sprite.play(this.avatar);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.wrapper = this;

    this.bullet = 'rainbow_bomb';

    Player.active_players[id] = this;
  };

  static load_animations(scene) {
    names = ['appy', 'blaze', 'cloudy', 'codey', 'earnie', 'einstein', 'hootie', 'koa', 'astro']
	names.forEach(function(name) {
	  scene.load.animation(name, 'animations/players/' + name + '.json'); 
    });

    scene.load.animation('rainbow_bomb', 'animations/bullets/rainbow_bomb.json');
  };

  static load() {
    Player.players = scene.physics.add.group();
    Player.bullets = scene.physics.add.group();
  };

  fire() {
    let bullet = bullets.create(this.sprite.x + 50, this.sprite.y + 20, this.bullet + '1');
    scene.physics.add.collider(bullet, enemies, this.bullet_strike, null, scene);
    bullet.play(this.bullet);
    bullet.setVelocityX(Player.bullets[this.bullet].speed);
  };

  bullet_strike(bullet, enemy) {
    enemy.wrapper.die();
    bullet.destroy();
  };
};

Player.active_players = {};
Player.speed = 200;
