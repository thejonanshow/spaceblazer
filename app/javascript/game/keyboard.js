import config from 'game/config';

const KEYDOWN = {
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

const KEYUP = {
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

function echoCommand(id, command) {
  Cable.send( "echo_command", { id: id, command: command });
};

function addKeyboardControls(scene) {
  if (config.disable_keyboard_controls) {
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

      if (event.shiftKey && Player.roomForMorePlayers()) {
        id = id + '-' + Player.allPlayers.length;
      }

      if ((keyname == 'ENTER') || (Player.activePlayers[id])) {
        command = KEYDOWN[keyname]
        echoCommand(id, command);
      }
    });
  });
  Object.keys(KEYUP).forEach(function(keyname) {
    scene.input.keyboard.on('keyup_' + keyname, function (event) {
      let id = game.fingerprint;

      if (Player.activePlayers[id]) {
        command = KEYUP[keyname]
        echoCommand(id, command);
      }
    });
  });
};

export { echoCommand, addKeyboardControls };
