class Explosion {
  constructor(doomed, options) {
    this.owner = doomed;

    let scale = 1;
    if (options && options.scale) {
      scale = options.scale;
    };

    this.sprite = doomed.scene.add.sprite(doomed.sprite.x, doomed.sprite.y, 'animations/explosions/server/explosion1');

    this.sprite.setScale(scale);
    this.sprite.play('server_explosion');
  }
}
export default Explosion;
