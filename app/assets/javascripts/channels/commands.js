//= require cable
//= require_self
//= require_tree .

this.App = {};

App.cable = ActionCable.createConsumer();

App.commands = App.cable.subscriptions.create('CommandsChannel', {
  received: function(data) {
    console.log(data);
  }
});

// ws.onmessage = event => {
//   console.log(event.data);
//   let data = JSON.parse(event.data);
//   let id = data.id
//   let command = data.command

//   if (command == 'online') {
//     let avatar_key = available_avatars[Math.floor(Math.random()*items.length)];
//     available_avatars.remove(avatar_key);
//     used_avatars.push(avatar_key);
//     players[id] = { avatar: avatar_key, score: 0 }
//   }
//   else if (command == 'u') {
//     moveUp();
//   }
//   else if (command == 'd') {
//     moveDown();
//   }
//   else if (command == 'l') {
//     moveLeft();
//   }
//   else if (command == 'r') {
//     moveRight();
//   }
//   else if (command == '9' || command == '0') {
//     stopY();
//   }
//   else if (command == 'k' || command == 'e') {
//     stopX();
//   }
//   else if (command == 'b') {
//     fire();
//   }
// }

