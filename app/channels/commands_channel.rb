class CommandsChannel < ApplicationCable::Channel
  def subscribed(*params)
    ActionCableClient.add(uid)
    ActionCable.server.broadcast("commands", { id: "system", notice: "#{ActionCableClient.count} clients connected, #{ActionCableClient.unique} unique." }.to_json)

    stream_from "commands"
    stream_from "commands-#{uid}"

    Device.first_or_create(external_id: uid).send_game
  end

  def unsubscribed
    if uid.include? "|"
      Laserbonnet.offline(uid)
    end

    ActionCableClient.remove(uid)
  end

  def register_player(data)
    Game.add_player(data["id"])
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

  def log_debug(data)
    Rails.logger.debug(data["message"])
  end

  def new_game
    Game.new_game
  end

  def fetch_game(data)
    Game.fetch_game(data)
  end

  def finish_game(data)
    Game.finish_game(data)
  end
end
