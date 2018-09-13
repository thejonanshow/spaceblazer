function move_up(entity) {
  entity.sprite.setVelocityY(-Player.speed);
};

function move_down(entity) {
  entity.sprite.setVelocityY(Player.speed);
};

function move_left(entity) {
  entity.sprite.setVelocityX(-Player.speed);
};

function move_right(entity) {
  entity.sprite.setVelocityX(Player.speed);
};

function stop(entity) {
  entity.sprite.setVelocityX(0);
  entity.sprite.setVelocityY(0);
};

function stop_x(entity) {
  entity.sprite.setVelocityX(0);
};

function stop_y(entity) {
  entity.sprite.setVelocityY(0);
};
