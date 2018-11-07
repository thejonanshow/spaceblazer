import createSubscription from "cable";
import Spaceblazer from "spaceblazer";
import ConsoleLogger from 'game/console_logger';

class GamesChannel {
  constructor() {
    this.subscription = null;
  }

  subscribe(subscriber) {
    createSubscription(subscriber, "GamesChannel", {
      connected(data) {
        ConsoleLogger.debug("Device " + Spaceblazer.current.id + " connected to game channel.");
      },
      received(data) {
        switch(data['event']) {
          case 'player_created':
            Spaceblazer.createPlayer(data['player']);
            break;
          default:
            break;

        }
        ConsoleLogger.debug("Device " + Spaceblazer.current.id + " received data on game channel: " + JSON.stringify(data));
      },
      disconnected(data) {
        ConsoleLogger.debug("Device " + Spaceblazer.current.id + " disconnected from game channel.");
      }
    });
  }

  perform(action, data) {
    this.subscription.perform(action, data);
  }
}

export default GamesChannel;
