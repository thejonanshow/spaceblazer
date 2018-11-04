function handleCommand(data) {
  Spaceblazer.current.debugLog("Command received: " + data);

  let parsed = JSON.parse(data);
  let id = parsed.id;

  if (id == "system") {
    handleSystemCommand(data);
    return;
  };

  let command = parsed.command;

  Spaceblazer.current.debugLog(command);

  let player = Player.activePlayers[id]

  if (player || command == 's') {
    if (command == 's' && Spaceblazer.reset) {
      Spaceblazer.reset = false;
      Spaceblazer.fetchGame();
      Spaceblazer.restart();
    }
    else if (command == 's') {
      if (!Player.activePlayers[id]) {
        Cable.send("register_player",  { id: id })
      }

      if (!game.scene.isActive('main')) {
        game.scene.switch('title', 'main');
      }
    }
    else if (command == 'n') {
      Cable.send( "new_game", { id: game.fingerprint, });
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
      stopX(Player.activePlayers[id]);
    }
    else if (command == 'b') {
      Player.activePlayers[id].fire();
    }
  };
};

function handleSystemCommand(data) {
  Spaceblazer.current.debugLog("System command: " + data);

  let parsed = JSON.parse(data);

  if (parsed.notice) {
    Spaceblazer.current.debugLog("System command: notice - " + parsed);
  }
  else if (parsed.player_created) {
    Player.create(parsed.player_created, game.mainScene);
    Spaceblazer.current.debugLog("System command: player_created - " + parsed);
  }
  else if (parsed.game_finished) {
    Spaceblazer.current.debugLog("System command: game_finished - " + parsed);
  }
  else if (parsed.game_info) {
    Player.addPlayers(parsed.game_info.players);
  }
  else if (parsed.command == "start_game") {
    scene.started = true;
    Spaceblazer.current.debugLog("System command: start_game - " + parsed);
  }
  else if (parsed.commmand == "stop_game") {
    Spaceblazer.current.debugLog("System command: stop_game - " + parsed);
  }
  else {
    Spaceblazer.current.debugLog("System command: unrecognized - " + parsed);
  }
};
export { handleCommand };
