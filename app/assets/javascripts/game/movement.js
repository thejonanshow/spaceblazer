function moveUp(entity) {
  // return unless game started
  entity.sprite.setVelocityY(-entity.speed);
};

function moveDown(entity) {
  // return unless game started
  entity.sprite.setVelocityY(entity.speed);
};

function moveLeft(entity) {
  // return unless game started
  entity.sprite.setVelocityX(-entity.speed);
};

function moveRight(entity) {
  // return unless game started
  entity.sprite.setVelocityX(entity.speed);
};

function stop(entity) {
  entity.sprite.setVelocityX(0);
  entity.sprite.setVelocityY(0);
};

function stopX(entity) {
  entity.sprite.setVelocityX(0);
};

function stopY(entity) {
  entity.sprite.setVelocityY(0);
};
