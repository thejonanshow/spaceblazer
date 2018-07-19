import * as PIXI from 'pixi.js';

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application();

const speed = 0.1;

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);

import bunnyImg from './assets/images/einstein.png';

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

let leftKey  = keyboard(37);
let upKey    = keyboard(38);
let rightKey = keyboard(39);
let downKey  = keyboard(40);
let spaceKey = keyboard(32);

// load the texture we need
PIXI.loader.add('bunny', bunnyImg).load((loader, resources) => {
    // This creates a texture from a 'bunny.png' image
    const bunny = new PIXI.Sprite(resources.bunny.texture);

    // Setup the position of the bunny
    bunny.x = app.renderer.width / 2;
    bunny.y = app.renderer.height / 2;

    // Rotate around the center
    bunny.anchor.x = 0.5;
    bunny.anchor.y = 0.5;

    rightKey.press = () => {
      bunny.anchor.x = bunny.anchor.x - speed;
    }
    downKey.press = () => {
      bunny.anchor.y = bunny.anchor.y - speed;
    }
    leftKey.press = () => {
      bunny.anchor.x = bunny.anchor.x + speed;
    }
    upKey.press = () => {
      bunny.anchor.y = bunny.anchor.y + speed;
    }
    spaceKey.press = () => {
      alert("POW");
    }

    // Add the bunny to the scene we are building
    app.stage.addChild(bunny);

    // Listen for frame updates
    app.ticker.add(() => {
         // each frame we spin the bunny around a bit
    });
});


const messages = document.querySelector('#messages');
const wsButton = document.querySelector('#wsButton');

const showMessage = (message) => {
  messages.textContent += `\n${message}`;
  messages.scrollTop = messages.scrollHeight;
};

let ws;

wsButton.onclick = () => {
  if (ws) {
    ws.onerror = ws.onopen = ws.onclose = null;
    ws.close();
  }
  let url = `ws://${location.host}/ws`
  if (window.location.protocol.match('https')) url = url.replace(/^ws:/, 'wss:');
  console.log("Connecting to ", url);
  ws = new WebSocket(url);
  ws.onerror = () => showMessage('-----> WebSocket error');
  ws.onopen = () => showMessage('-----> WebSocket connection established');
  ws.onclose = () => showMessage('-----> WebSocket connection closed');
  ws.onmessage = event => showMessage(event.data);
};
