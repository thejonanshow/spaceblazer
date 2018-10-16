class Display < ApplicationRecord
  validates :external_id, presence: true, uniqueness: true
  validates :online, presence: true

  def send_game_info
    game_json = Game.current.to_json(include: :players)
    DisplaysChannel.broadcast_to(self, game_json)
  end

  def self.broadcast_to_all(data)
    Display.where(online: true).each do |display|
      DisplaysChannel.broadcast_to(display, data)
    end
  end
end
