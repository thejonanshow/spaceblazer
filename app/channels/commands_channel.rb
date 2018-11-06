class CommandsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "commands"
  end

  def unsubscribed
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
end
