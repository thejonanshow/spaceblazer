class Player < ApplicationRecord
  belongs_to :game
  belongs_to :device

  validates :device_id, presence: true
  validates :game_id, presence: true
  validates :avatar_slug, presence: true
  validates :avatar_slug, uniqueness: { scope: :game_id }

  after_create :broadcast_create

  def initialize(*args)
    super(*args)
    assign_slug
  end

  def broadcast_create
    DevicesChannel.broadcast_to(self.device, self)
  end

  def assign_slug
    self.avatar_slug = "astro_blue"
  end

  def info
    {
      id: self.id,
      avatar: self.avatar_slug,
      game_id: self.game.id
    }
  end
end
