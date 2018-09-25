import createChannel from "cable";

let channel;

class GamesChannel {
  constructor() {
    this.connection = channel;
  }

  connect(subscriber, connectedCallback, receivedCallback, disconnectedCallback) {
    channel = createChannel(subscriber, "GamesChannel", {
      connected({}) {
        if (connectedCallback) connectedCallback.call(null, params);
      },
      received({}) {
        if (receivedCallback) receivedCallback.call(null, params);
      },
      disconnected({}) {
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
