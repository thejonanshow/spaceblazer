class Game {
  constructor() {
    this.state = {};
    this.debug = true;
  }

  debugLog(message) {
    if (this.debug) {
      console.log(message);
    };
  }
}
export default Game;
