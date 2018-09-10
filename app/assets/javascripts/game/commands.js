function handle_command(data) {
  let parsed = JSON.parse(data);
  let id = parsed.id;
  let command = parsed.command;

  if (debug) {
    console.log(command);
  };

  if (!Player.active_players[id]) {
    new Player(id);
    new Enemy();
  }

  let player = Player.active_players[id]

  if (command == 'online') {
  }
  else if (command == 'u') {
    player.move_up();
  }
  else if (command == 'd') {
    player.move_down();
  }
  else if (command == 'l') {
    player.move_left();
  }
  else if (command == 'r') {
    player.move_right();
  }
  else if (command == '9' || command == '0') {
    player.stop_y();
  }
  else if (command == '-' || command == '=') {
    player.stop_x();
  }
  else if (command == 'b') {
    player.fire();
  }
};
