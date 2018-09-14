//= require ./fingerprint

KEYDOWN_EVENTS = {
  A: "a",
  B: "b",
  X: "x",
  Y: "y",
  TAB: "t",
  ENTER: "s",
  O: "o",
  W: "w",
  UP: "u",
  DOWN: "d",
  LEFT: "l",
  RIGHT: "r",
  SPACE: "b"
};

KEYUP_EVENTS = {
  A: "1",
  B: "2",
  X: "3",
  Y: "4",
  TAB: "5",
  ENTER: "6",
  O: "7",
  W: "8",
  UP: "9",
  DOWN: "0",
  LEFT: "-",
  RIGHT: "=",
  SPACE: "2"
};

function add_keyboard_controls(scene) {
  Object.keys(KEYDOWN_EVENTS).forEach(function(keyname) {
    scene.input.keyboard.on('keydown_' + keyname, function (event) {
      console.log(keyname);
      if ((keyname == 'ENTER') || (Player.active_players[fingerprint])) {
        App.cable.subscriptions.subscriptions[0].perform(
          "echo_command",
          {
            id: fingerprint,
            command: KEYDOWN_EVENTS[keyname]
          }
        );
      }
    });
  });
  Object.keys(KEYUP_EVENTS).forEach(function(keyname) {
    scene.input.keyboard.on('keyup_' + keyname, function (event) {
      if (Player.active_players[fingerprint]) {
        App.cable.subscriptions.subscriptions[0].perform(
          "echo_command",
          {
            id: fingerprint,
            command: KEYUP_EVENTS[keyname]
          }
        );
      }
    });
  });
};
