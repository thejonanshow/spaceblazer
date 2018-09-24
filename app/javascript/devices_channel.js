// frontend/client/chat.js
import createChannel from "cable";

let callback; // declaring a variable that will hold a function later

const chat = createChannel("DevicesChannel", {
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
