class GamesChannel < ApplicationCable::Channel
  def subscribed
    stream_for current_game
  end

  def create_player(params)
    device = Device.where(external_id: params[:external_id]).first
    current_game.players.create!(device_id: device.id)
  end

  def fetch_game(params)
    current_game.fetch_game(params[:device_id])
  end

  def start_game(params)
    current_game.start_game({})
  end

  def finish_game(params)
    current_game.finish_game({
      game_data: params[:game_data]
    });
  end

  def current_game
    Game.current
  end
end
