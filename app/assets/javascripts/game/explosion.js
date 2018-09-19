class Explosion {
  constructor(doomed, options) {
    this.owner = doomed;

    let scale = 1;
    if (options && options.scale) {
      scale = options.scale;
    };

    let explosion = doomed.scene.add.sprite(doomed.sprite.x, doomed.sprite.y, 'animations/explosions/server/explosion1');
    explosion.setScale(scale);
    explosion.play('server_explosion');
  }
}
