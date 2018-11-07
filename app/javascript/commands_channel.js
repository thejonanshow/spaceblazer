import createSubscription from "cable";
import Spaceblazer from "spaceblazer";
import { handleCommand } from 'game/command_handler';
import ConsoleLogger from 'game/console_logger';

class CommandsChannel {
  constructor() {
    this.subscription = null;
  }

  subscribe(subscriber) {
    createSubscription(subscriber, "CommandsChannel", {
      connected(data) {
        ConsoleLogger.debug("Device " + Spaceblazer.current.id + " connected to command channel.");
      },
      received(data) {
        handleCommand(data);
        ConsoleLogger.debug("Device " + Spaceblazer.current.id + " received data on command channel: " + JSON.stringify(data));
      },
      disconnected(data) {
        ConsoleLogger.debug("Device " + Spaceblazer.current.id + " disconnected from command channel.");
      }
    });
  }
}

export default CommandsChannel;
