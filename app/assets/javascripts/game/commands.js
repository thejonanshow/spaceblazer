function handle_command(data) {
  let parsed = JSON.parse(data);
  let id = parsed.id;
  let command = parsed.command;

  if (debug) {
    console.log(command);
  };

  if (!players[id]) {
    new_player(id);
    new_enemy();
  }

  let sprite = players[id].sprite;

  if (command == 'online') {
  }
  else if (command == 'u') {
    moveUp(sprite);
  }
  else if (command == 'd') {
    moveDown(sprite);
  }
  else if (command == 'l') {
    moveLeft(sprite);
  }
  else if (command == 'r') {
    moveRight(sprite);
  }
  else if (command == '9' || command == '0') {
    stopY(sprite);
  }
  else if (command == '-' || command == '=') {
    stopX(sprite);
  }
  else if (command == 'b') {
    fire(sprite);
  }
};
