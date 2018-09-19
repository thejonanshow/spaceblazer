class PowerUp {
  constructor(owner) {
    this.owner = owner;
    this.sprite = owner.scene.matter.add.sprite(owner.sprite.x, owner.sprite.y, 'multipass', 'powerups/cloud/cloud1');
    this.sprite.setFriction(0, 0, 0);
    this.sprite.setCollidesWith(Player.collisionCategory);
    this.sprite.setVelocityX(-3);
    this.acquired = false;

    this.sprite.wrapper = this;
  }

  get(winner) {
    if (this.acquired) {
      return;
    }
    this.acquired = true;
    this.sprite.play('cloud');
    winner.levelUp();

    this.owner.scene.time.addEvent({
      delay: 500,
      callback: function() {
        this.destroy();
      },
      callbackScope: this.sprite
    });
  }
}
