import createChannel from "cable";

let callback;

const devicesChannel = createChannel("DevicesChannel", {
  connected({ data }) {},
  received({ data }) {
    if (callback) callback.call(null, data);
  },
  disconnected({ data }) {}
});

function perform(action, data) {
  devicesChannel.perform(action, data);
}

function setCallback(fn) {
  callback = fn;
}

export { perform, setCallback };
