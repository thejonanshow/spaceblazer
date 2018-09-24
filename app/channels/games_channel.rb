class GamesChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def create_player(params)
    player = Game.current.players.create(device_id: params[:device_id])
  end
end
