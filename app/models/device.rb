class Device < ApplicationRecord
  validates :external_id, presence: true, uniqueness: true
  validates :online, presence: true

  def send_game
    DevicesChannel.broadcast_to(self, Game.current)
  end
end
