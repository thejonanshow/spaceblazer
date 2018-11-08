class CommandsChannel < ApplicationCable::Channel
  def subscribed
    if (params)
      Rails.logger.debug("CommandsChannel#subscribed: #{params.inspect}")

      if (params["id"])
        Rails.logger.debug("CommandsChannel#subscribed: #{params['id']}")
        ActionCableClient.add(uid)
        ActionCable.server.broadcast("commands", { id: "system", notice: "#{ActionCableClient.count} clients connected, #{ActionCableClient.unique} unique." }.to_json)

        stream_from "commands-#{uid}"

        if uid.include? "|"
          Laserbonnet.register(uid)
        else
          # it's a browser, send info about the current game
          Game.fetch_game(uid)
        end
      end
    end

    stream_from "commands"
  end

  def unsubscribed
    uid = params["id"]
    return unless uid

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

  def save_game(data)
    Game.save_game(data)
  end
end
