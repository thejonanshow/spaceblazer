// Set websocket URL
let url = `ws://${location.host}/ws`;
if (window.location.protocol.match('https')) url = url.replace(/^ws:/, 'wss:');

ws = new WebSocket(url);
ws.onerror = () => console.log('-----> WebSocket error');
ws.onopen = () => console.log('-----> WebSocket connection established');
ws.onclose = () => console.log('-----> WebSocket connection closed');
ws.onmessage = event => console.log(event.data);

function redisEvent(character) {
  const key = {};

  const downHandler = event => {
    const message = JSON.parse(event.data)
    if (message && message.command) {
      if (message.command === character && key.press) key.press()
    }
  }

  const upHandler = event => {
    const message = JSON.parse(event.data)
    if (message && message.command) {
      if (message.command === `${character}x` && key.release) key.release()
    }
  }

  ws.addEventListener('message', downHandler.bind(this));
  ws.addEventListener('message', upHandler.bind(this));
  
  return key;
}

function keyboard(keyCode) {
  let key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    console.log(event.keyCode);
    if (event.keyCode === key.code) {
      key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}

module.exports = { keyboard, redisEvent };
