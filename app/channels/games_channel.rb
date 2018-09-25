class GamesChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def create_player(params)
    player = Game.current.players.create(device_id: params[:device_id]);
  end

  def fetch_game(params)
    Game.current.fetch_game(params[:device_id]);
  end

  def start_game(params)
    Game.current.start_game({
    })
  end

  def finish_game(params)
    Game.current.finish_game({
      game_data: params[:game_data]
    });
  end
end
