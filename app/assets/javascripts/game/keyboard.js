KEYDOWN = {
  K: "a",
  L: "b",
  COMMA: "x",
  PERIOD: "y",
  BACKSLASH: "t",
  ENTER: "s",
  OPEN_BRACKET: "o",
  CLOSE_BRACKET: "w",
  UP: "u",
  DOWN: "d",
  LEFT: "l",
  RIGHT: "r",
  SPACE: "b"
};

KEYUP = {
  K: "1",
  L: "2",
  COMMA: "3",
  PERIOD: "4",
  BACKSLASH: "5",
  ENTER: "6",
  OPEN_BRACKET: "7",
  CLOSE_BRACKET: "8",
  UP: "9",
  DOWN: "0",
  LEFT: "-",
  RIGHT: "=",
  SPACE: "2"
};

function echo_command(id, command) {
  App.cable.subscriptions.subscriptions[0].perform(
    "echo_command", { id: id, command: command }
  );
};

function addKeyboardControls(scene) {
  if (spaceblazerConfig('disable_keyboard')) {
    return;
  }
  scene.input.keyboard.on('keydown', function(event) {
    debugLog(event);
  });
  scene.input.keyboard.on('keyup', function(event) {
    debugLog(event);
  });

  Object.keys(KEYDOWN).forEach(function(keyname) {
    scene.input.keyboard.on('keydown_' + keyname, function (event) {
      let id = game.fingerprint;

      if ((keyname == 'ENTER') || (Player.activePlayers[id])) {
        command = KEYDOWN[keyname]
        echo_command(id, command);
      }
    });
  });
  Object.keys(KEYUP).forEach(function(keyname) {
    scene.input.keyboard.on('keyup_' + keyname, function (event) {
      let id = game.fingerprint;

      if (Player.activePlayers[id]) {
        command = KEYUP[keyname]
        echo_command(id, command);
      }
    });
  });
};
