class Player < ApplicationRecord
  belongs_to :game
  validates :client_side_id, uniqueness: { scope: :game_id }
end
