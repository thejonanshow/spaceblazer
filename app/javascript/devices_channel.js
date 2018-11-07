import createSubscription from "cable";
import Spaceblazer from "spaceblazer";
import ConsoleLogger from 'game/console_logger';

class DevicesChannel {
  constructor() {
    this.subscription = null;
  }

  subscribe(subscriber) {
    createSubscription(subscriber, "DevicesChannel", {
      connected(data) {
        ConsoleLogger.debug("Device " + Spaceblazer.current.id + " connected to device channel.");
      },
      received(data) {
        ConsoleLogger.debug("Device " + Spaceblazer.current.id + " received data on device channel: " + JSON.stringify(data));
      },
      disconnected(data) {
        ConsoleLogger.debug("Device " + Spaceblazer.current.id + " disconnected from device channel.");
      }
    });
  }

  perform(action, data) {
    this.subscription.perform(action, data);
  }
}

export default DevicesChannel;
