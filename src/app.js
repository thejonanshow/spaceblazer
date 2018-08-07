import dotenv from 'dotenv';
dotenv.config();

const path = require('path');
const redis = require('redis');
const express = require('express');
const http = require('http');
const nodeCleanup = require('node-cleanup');
const WebSocket = require('ws');

import app from './server'
const server = http.createServer(app);
let currentApp = app
const port = (process.env.PORT ? process.env.PORT : 3000)

app.use(express.static('assets/images'));
app.use(express.static('build'));
server.listen(port, () => console.log(`Listening on port ${port}`));

if (module.hot) {
  module.hot.accept('./server', () => {
    server.removeListener('request', currentApp)
    server.on('request', app)
    currentApp = app
  })
}

const wss = new WebSocket.Server({server});

const client = redis.createClient(process.env.REDIS_URL);
client.on("error", err => console.log("Redis error: " + err));
client.on('subscribe', (channel, count) => console.log(`Subscribed to redis channel "${channel}"`));
client.subscribe(process.env.REDIS_CHANNEL);

function noop() {}

function heartbeat() {
  this.isAlive = true;
}

wss.on('connection', (ws, req) => {
  console.log('New WebSocket connection created')

  ws.isAlive = true;
  ws.on('pong', heartbeat);

  client.on('message', (channel, message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log(`Sending message from "${channel}" channel to WebSocket client: "${message}"`);
      ws.send(message);
    }
  })

  ws.on('close', (code, reason) => {
    console.log(`WebSocket connection closed: ${reason} (${code})`);
  })
});

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) {
      return ws.terminate();
    }

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 25000);

nodeCleanup((exitCode, signal) => {
  console.log(`${signal} received. Cleaning up...`)
  if (client) client.unsubscribe();
})
