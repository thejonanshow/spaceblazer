import createChannel from "cable";

let callback;

const devicesChannel = createChannel("DevicesChannel", {
  received({ data }) {
    if (callback) callback.call(null, data);
  }
});

function perform(action, data) {
  chat.perform(action, data);
}

function setCallback(fn) {
  callback = fn;
}

export { perform, setCallback };
