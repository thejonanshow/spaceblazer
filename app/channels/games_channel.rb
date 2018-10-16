class GamesChannel < ApplicationCable::Channel
  def subscribed
    if current_device
      Rails.logger.debug current_device.inspect
    end

    stream_for current_game
    current_device.update(online: true)
  end

  def unsubscribed
    current_device.update(online: false)
  end

  def create_player(params)
    player = Game.current.players.create(device_id: params[:device_id]);
  end

  def fetch_game(params)
    Game.current.fetch_game(params[:device_id]);
  end

  def start_game(params)
    Game.current.start_game({})
  end

  def finish_game(params)
    Game.current.finish_game({
      game_data: params[:game_data]
    });
  end
end
