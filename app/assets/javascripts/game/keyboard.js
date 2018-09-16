//= require ./fingerprint

KEYDOWN1 = {
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

KEYUP1 = {
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

KEYDOWN2 = {
  R: "a",
  T: "b",
  F: "x",
  G: "y",
  BACKTICK: "t",
  V: "s",
  NUMBER_ONE: "o",
  NUMBER_TWO: "w",
  W: "u",
  S: "d",
  A: "l",
  D: "r",
  X: "b"
};

KEYUP2 = {
  R: "1",
  T: "2",
  F: "3",
  G: "4",
  BACKTICK: "5",
  V: "6",
  NUMBER_ONE: "7",
  NUMBER_TWO: "8",
  W: "9",
  S: "0",
  A: "-",
  D: "=",
  X: "2"
};

function echo_command(id, command) {
  App.cable.subscriptions.subscriptions[0].perform(
    "echo_command", { id: id, command: command }
  );
};

function add_keyboard_controls(scene) {
  [KEYDOWN1, KEYDOWN2].forEach(function(keyMap, index) {
    Object.keys(keyMap).forEach(function(keyname) {
      scene.input.keyboard.on('keydown_' + keyname, function (event) {
        let id = game.fingerprint + 'player' + (index + 1);

        if ((keyname == 'ENTER') || (keyname == 'V') || (Player.activePlayers[id])) {
          command = keyMap[keyname]
          echo_command(id, command);
        }
      });
    });
  });
  [KEYUP1, KEYUP2].forEach(function(keyMap, index) {
    Object.keys(keyMap).forEach(function(keyname) {
      scene.input.keyboard.on('keyup_' + keyname, function (event) {
        let id = game.fingerprint + 'player' + (index + 1);

        if (Player.activePlayers[id]) {
          command = keyMap[keyname]
          echo_command(id, command);
        }
      });
    });
  });
};
