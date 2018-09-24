import createChannel from "cable";

let channel;

class GamesChannel {
  constructor() {
    this.connection = channel;
  }

  connect(subscriber, connectedCallback, receivedCallback, disconnectedCallback) {
    channel = createChannel(subscriber, "GamesChannel", {
      connected(params) {
        if (connectedCallback) connectedCallback.call(null, params);
      },
      received(params) {
        if (receivedCallback) receivedCallback.call(null, params);
      },
      disconnected(params) {
        if (disconnectedCallback) disconnectedCallback.call(null, params);
      }
    });
    return channel;
  }

  perform(action, data) {
    channel.perform(action, data);
  }
}

export default GamesChannel;
