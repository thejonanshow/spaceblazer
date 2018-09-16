function handleCommand(data) {
  let parsed = JSON.parse(data);
  let id = parsed.id;

  if (id == "system") {
    handleSystemCommand(data);
    return;
  };

  let command = parsed.command;

  if (debug) {
    console.log(command);
  };

  let player = Player.activePlayers[id]

  if (command == 'online') {
  }
  else if (command == 's') {
    if (!Player.active_players[id]) {
      App.cable.subscriptions.subscriptions[0].perform("register_player",  { id: id })
    }

    if (!game.scene.isActive('main')) {
      game.scene.switch('title', 'main');
    }
  }
  else if (command == 'u') {
    moveUp(Player.activePlayers[id]);
  }
  else if (command == 'd') {
    moveDown(Player.activePlayers[id]);
  }
  else if (command == 'l') {
    moveLeft(Player.activePlayers[id]);
  }
  else if (command == 'r') {
    moveRight(Player.activePlayers[id]);
  }
  else if (command == '9' || command == '0') {
    stopY(Player.activePlayers[id]);
  }
  else if (command == '-' || command == '=') {
    stop_x(Player.activePlayers[id]);
  }
  else if (command == 'b') {
    Player.activePlayers[id].fire();
  }
};

function handleSystemCommand(data) {
  console.log("System command received: " + data);
  let parsed = JSON.parse(data);

  if (parsed.notice) {
    console.log(parsed.notice);
  }
  else if (parsed.player_created) {
    Player.create(parsed.player_created, game.scene.scenes[1]);
    console.log(parsed.player_created);
  }
  else if (parsed.command == "start_game") {
    scene.started = true;
  }
  else if (parsed.commmand == "stop_game") {
    console.log("STOPPING");
  }
  else {
    console.log("Unrecognized system command: " + parsed.command);
  }
};
