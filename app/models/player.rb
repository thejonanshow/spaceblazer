class Player < ApplicationRecord
  belongs_to :game
  validates :client_side_id, uniqueness: { scope: :game_id }
  after_create :broadcast_create

  def broadcast_create
    message = {
      id: "system",
      player_created: { id: self.client_side_id, avatar: "#{self.avatar_slug}", game_id: self.game.id }
    }
    ActionCable.server.broadcast("commands", message.to_json)
  end

  def avatar_slug
    "#{self.avatar}_#{self.color}"
  end
end
