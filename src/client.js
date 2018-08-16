import './styles/default.css';
const game = require('./game');

let ws;
let url = `ws:\/\/${location.host}`
console.log(url);
if (window.location.protocol.match('https')) url = url.replace(/^ws:/, 'wss:');
console.log("Connecting to ", url);

ws = new WebSocket(url);

ws.onerror = () => console.log('-----> WebSocket error');
ws.onopen = () => console.log('-----> WebSocket connection established');
ws.onclose = () => console.log('-----> WebSocket connection closed');

ws.onmessage = event => {
  console.log(event.data);
  var command = JSON.parse(event.data)["command"];

  if (command == 'd') {
    game.moveDown();
  }
  else if (command == '8') {
    game.stopY();
  }
  else if (command == 'u') {
    game.moveUp();
  }
  else if (command == '7') {
    game.stopY();
  }
  else if (command == 'l') {
    game.moveLeft();
  }
  else if (command == '9') {
    game.stopX();
  }
  else if (command == 'r') {
    game.moveRight();
  }
  else if (command == '0') {
    game.stopX();
  }
  else if (command == 'b') {
    game.fire();
  }
}
