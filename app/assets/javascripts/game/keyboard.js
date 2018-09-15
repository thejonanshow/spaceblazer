//= require ./fingerprint

KEYDOWN_EVENTS_PLAYER_1 = {
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

KEYUP_EVENTS_PLAYER_1 = {
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

KEYDOWN_EVENTS_PLAYER_2 = {
  R: "a",
  T: "b",
  F: "x",
  G: "y",
  BACKTICK: "t",
  TAB: "s",
  NUMBER_ONE: "o",
  NUMBER_TWO: "w",
  W: "u",
  S: "d",
  A: "l",
  D: "r",
  X: "b"
};

KEYUP_EVENTS_PLAYER_2 = {
  R: "1",
  T: "2",
  F: "3",
  G: "4",
  BACKTICK: "5",
  TAB: "6",
  NUMBER_ONE: "7",
  NUMBER_TWO: "8",
  W: "9",
  S: "0",
  A: "-",
  D: "=",
  X: "2"
};

function add_keyboard_controls(scene) {
  Object.keys(KEYDOWN_EVENTS_PLAYER_1).forEach(function(keyname) {
    scene.input.keyboard.on('keydown_' + keyname, function (event) {
      console.log(keyname);
      if ((keyname == 'ENTER') || (Player.active_players[fingerprint + "player1"])) {
        App.cable.subscriptions.subscriptions[0].perform(
          "echo_command",
          {
            id: fingerprint + "player1",
            command: KEYDOWN_EVENTS_PLAYER_1[keyname]
          }
        );
      }
    });
  });
  Object.keys(KEYUP_EVENTS_PLAYER_1).forEach(function(keyname) {
    scene.input.keyboard.on('keyup_' + keyname, function (event) {
      if (Player.active_players[fingerprint + "player1"]) {
        App.cable.subscriptions.subscriptions[0].perform(
          "echo_command",
          {
            id: fingerprint + "player1",
            command: KEYUP_EVENTS_PLAYER_1[keyname]
          }
        );
      }
    });
  });
  Object.keys(KEYDOWN_EVENTS_PLAYER_2).forEach(function(keyname) {
    scene.input.keyboard.on('keydown_' + keyname, function (event) {
      console.log(keyname);
      if ((keyname == 'TAB') || (Player.active_players[fingerprint + "player2"])) {
        App.cable.subscriptions.subscriptions[0].perform(
          "echo_command",
          {
            id: fingerprint + "player2",
            command: KEYDOWN_EVENTS_PLAYER_2[keyname]
          }
        );
      }
    });
  });
  Object.keys(KEYUP_EVENTS_PLAYER_2).forEach(function(keyname) {
    scene.input.keyboard.on('keyup_' + keyname, function (event) {
      if (Player.active_players[fingerprint + "player2"]) {
        App.cable.subscriptions.subscriptions[0].perform(
          "echo_command",
          {
            id: fingerprint + "player2",
            command: KEYUP_EVENTS_PLAYER_2[keyname]
          }
        );
      }
    });
  });
};
