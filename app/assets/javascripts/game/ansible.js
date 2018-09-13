function send_to_server(message) {
  var id_test = { channel: 'SystemChannel' };
  var stream_id = {
    command: message,
    identifier: id_test,
    data: {action: "new_player", content: "Hi everyone !"}
  }
  App.cable.send(JSON.stringify(stream_id));
};
