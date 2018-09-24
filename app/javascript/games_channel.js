import createChannel from "cable";

let callback;

const gamesChannel = createChannel("GamesChannel", {
  connected({ data }) {},
  received({ data }) {
    if (callback) callback.call(null, data);
  },
  disconnected({ data }) {}
});

function perform(action, data) {
  gamesChannel.perform(action, data);
}

function setCallback(fn) {
  callback = fn;
}

export { perform, setCallback };
