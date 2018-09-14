function handle_command(data) {
  let parsed = JSON.parse(data);
  let id = parsed.id;

  if (id == "system") {
    handle_system_command(data);
    return;
  };

  let command = parsed.command;

  if (debug) {
    console.log(command);
  };

  let player = Player.active_players[id]

  if (command == 'online') {
  }
  else if (command == 's') {
    // TODO: change this to 4 when we have multi-player working
    const MAX_PLAYERS = 1
    let activePlayerCount = Object.keys(Player.active_players).length

    if (!Player.active_players[id] && activePlayerCount < MAX_PLAYERS) {
      App.cable.subscriptions.subscriptions[0].perform("register_player",  { id: id })
      activePlayerCount++;
    }

    if (activePlayerCount === MAX_PLAYERS) {
      game.scene.switch('title', 'main');
    }
  }
  else if (command == 'u') {
    move_up(Player.active_players[id]);
  }
  else if (command == 'd') {
    move_down(Player.active_players[id]);
  }
  else if (command == 'l') {
    move_left(Player.active_players[id]);
  }
  else if (command == 'r') {
    move_right(Player.active_players[id]);
  }
  else if (command == '9' || command == '0') {
    stop_y(Player.active_players[id]);
  }
  else if (command == '-' || command == '=') {
    stop_x(Player.active_players[id]);
  }
  else if (command == 'b') {
    Player.active_players[id].fire();
  }
};

function handle_system_command(data) {
  console.log("System command received");
  let parsed = JSON.parse(data);

  if (parsed.notice) {
    console.log(parsed.notice);
  }
  else if (parsed.player_created) {
    Player.create(parsed.player_created);
    console.log(parsed.player_created);
  }
};
