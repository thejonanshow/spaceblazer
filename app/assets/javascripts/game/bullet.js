class Bullet {
  constructor(owner, options) {
    this.scene = owner.scene;
    this.owner = owner;
    this.type = this.owner.bulletType;
    this.worldCollisionCategory = 1;

    this.config = Bullet.config[this.type];

    this.startX = owner.sprite.x + owner.bulletOffset.x;
    this.startY = owner.sprite.y + owner.bulletOffset.y;
    this.speed = this.config.speed;

    if (options && options.reverse_direction) {
      this.speed = -this.speed;
    }

    this.firstFrame = this.config.firstFrame;
    this.shape = this.scene.shapes[this.type + "1"];

    this.sprite = this.scene.matter.add.sprite(
      this.startX,
      this.startY,
      'multipass',
      this.firstFrame,
      { 
        shape: this.shape
      }
    );

    this.sprite.originX = 0.5;
    this.sprite.originY = 0.5;

    let collisionCategories = [this.config.collides_with, this.worldCollisionCategory];

    let thisBullet = this;
    Object.keys(Bullet.config).forEach(function(bulletType) {
      let bulletConfig = Bullet.config[bulletType];

      if (bulletConfig != thisBullet.config) {
        collisionCategories.push(bulletConfig.collision_category);
      }
    });

    this.sprite.setCollidesWith(collisionCategories);

    this.sprite.setFriction(0, false, false);
    this.sprite.setCollisionCategory(this.config.collision_category);
    this.sprite.player = this;
    this.sprite.wrapper = this;

    this.sprite.play(this.type);
    this.sprite.setVelocityX(this.speed);

    Bullet.allBullets.push(this);
  }

  static load(currentScene) {
    Bullet.config = {
      rainbow_bomb: {
        speed: 30,
        animation_file: 'animations/bullets/rainbow_bomb.json',
        first_frame: 'bullets/rainbow_bomb/rainbow_bomb1',
        collision_category: currentScene.matter.world.nextCategory(),
        collides_with: Enemy.collisionCategory
      },
      floppy: {
        speed: -20,
        animation_file: 'animations/bullets/floppy.json',
        first_frame: 'bullets/floppy/floppy1',
        collision_category: currentScene.matter.world.nextCategory(),
        collides_with: Player.collisionCategory
      }
    }

    Object.keys(Bullet.config).forEach(function(type) {
      currentScene.load.animation(type, Bullet.config[type].animation_file);
    });
  }

  static update() {
    Bullet.allBullets.forEach(function(bullet) {
      bullet.update();
    });
  }

  update() {
  }

  collision(bodyA, bodyB) {
    if (bodyA.parent.gameObject.wrapper instanceof Bullet) {
      let bullet = bodyA.parent.gameObject.wrapper;

      if (bodyB.parent.gameObject === null) {
        bullet.destroy();
      }
      else if (bodyB.parent.gameObject.wrapper instanceof Bullet) {
        bodyB.parent.gameObject.wrapper.destroy();
        bullet.explode();
      }
    }
  }

  explode() {
    new Explosion(this, { scale: 0.5 });
    this.destroy();
  }

  destroy() {
    this.owner.bullets.remove(this);
    this.sprite.destroy();
  }
}
Bullet.allBullets = [];
