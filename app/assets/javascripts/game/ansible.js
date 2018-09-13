function send_to_server(message) {
  var id_test = { channel: 'SystemChannel' };
  var stream_id = {
    command: message,
    identifier: JSON.stringify(id_test),
    data: JSON.stringify({action: "speak", content: "Hi everyone !"})
  }
  App.cable.send(JSON.stringify(stream_id));
};
