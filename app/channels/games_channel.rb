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
    player = current_game.players.create(device_id: params[:device_id]);
  end

  def fetch_game(params)
    current_game.fetch_game(params[:device_id]);
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
