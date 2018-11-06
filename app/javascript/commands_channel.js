import createSubscription from "cable";

class CommandsChannel {
  constructor() {
    this.subscription = null;
  }

  subscribe(subscriber, connectedCallback, receivedCallback, disconnectedCallback) {
    createSubscription(subscriber, "CommandsChannel", {
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
  }
}

export default CommandsChannel;
