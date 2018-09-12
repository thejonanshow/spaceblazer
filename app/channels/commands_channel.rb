class CommandsChannel < ApplicationCable::Channel
  def subscribed(*params)
    ActionCableClient.add(uid)
    ActionCable.server.broadcast("commands", { id: "system", notice: "#{ActionCableClient.count} clients connected, #{ActionCableClient.unique} unique." }.to_json)
    stream_from "commands"
  end

  def unsubscribed
    ActionCableClient.remove(uid)
  end
end
