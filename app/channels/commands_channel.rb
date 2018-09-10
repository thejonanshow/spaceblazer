class CommandsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "commands"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
