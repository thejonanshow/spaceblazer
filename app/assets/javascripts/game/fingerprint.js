//= require fingerprint2

new Fingerprint2().get(function(result, components) {
  console.log("Fingerprint: " + result);
  let cable_url = document.head.querySelector("[name~=action-cable-url][content]").content

  this.App = {};
  App.cable = ActionCable.createConsumer(cable_url + "/?uid=" + result);

  App.commands = App.cable.subscriptions.create('CommandsChannel', {
    received: function(data) {
      console.log(data);
      handle_command(data);
    }
  });
})
