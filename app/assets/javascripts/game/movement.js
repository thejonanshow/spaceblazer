function moveUp(player){
  player.setVelocityY(-playerSpeed);
};

function moveDown(player){
  player.setVelocityY(playerSpeed);
};

function moveLeft(player){
  player.setVelocityX(-playerSpeed);
};

function moveRight(player){
  player.setVelocityX(playerSpeed);
};

function stop(player){
  player.setVelocityX(0);
  player.setVelocityY(0);
};

function stopX(player){
  player.setVelocityX(0);
};

function stopY(player){
  player.setVelocityY(0);
};
