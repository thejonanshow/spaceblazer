class CommandsChannel < ApplicationCable::Channel
  def subscribed(*params)
    stream_from "commands"
    stream_from "commands-#{uid}"

    Device.first_or_create(external_id: uid).send_game_info
  end

  def unsubscribed(*params)
    Device.where(external_id: uid).first.update(online: false)
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
