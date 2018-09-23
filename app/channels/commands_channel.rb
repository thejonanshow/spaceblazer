class CommandsChannel < ApplicationCable::Channel
  def subscribed(*params)
    ActionCableClient.add(uid)
    ActionCable.server.broadcast("commands", { id: "system", notice: "#{ActionCableClient.count} clients connected, #{ActionCableClient.unique} unique." }.to_json)
    stream_from "commands"
  end

  def unsubscribed
    ActionCableClient.remove(uid)
  end

  def register_player(data)
    Game.add_player(data["id"])
  end

  def register_laserbonnet(data)
    Laserbonnet.register(data["id"])
  end

  def echo_command(data)
    ActionCable.server.broadcast(
      "commands", 
      {
        id: data["id"],
        command: data["command"]
      }.to_json
    );
  end

  def echo(data)
    Rails.logger.debug(data)
  end

  def new_game
    Game.new_game
  end
end
