import Spaceblazer from 'spaceblazer';

class ConsoleLogger {
  static debug(message) {
    if (Spaceblazer.current.debug) {
      console.log(message);
    };
  }
}
export default ConsoleLogger;
