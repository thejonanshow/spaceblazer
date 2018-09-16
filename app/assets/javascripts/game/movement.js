function moveUp(entity) {
  entity.sprite.setVelocityY(-Player.speed);
};

function moveDown(entity) {
  entity.sprite.setVelocityY(Player.speed);
};

function moveLeft(entity) {
  entity.sprite.setVelocityX(-Player.speed);
};

function moveRight(entity) {
  entity.sprite.setVelocityX(Player.speed);
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
