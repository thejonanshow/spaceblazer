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
    GamesChannel.broadcast_to(
      self.game,
      event: :player_created,
      player: self
    )
  end

  def assign_slug
    all_players = Player.all
    used_colors = all_players.map(&:color).uniq
    used_characters = all_players.map(&:character).uniq
    used_avatars = all_players.map(&:avatar_slug).uniq

    available_colors = Game::COLORS - used_colors
    available_characters = Game::CHARACTERS - used_characters
    available_avatars = Game::ALL_AVATARS - used_avatars

    if available_colors.any? && available_characters.any?
      self.avatar_slug = "#{available_characters.sample}_#{available_colors.sample}"
    elsif available_colors.any?
      self.avatar_slug = "#{Game::CHARACTERS.sample}_#{available_colors.sample}"
    elsif available_characters.any?
      self.avatar_slug = "#{available_characters.sample}_#{Game::COLORS.sample}"
    elsif available_avatars.any?
      self.avatar_slug = available_avatars.sample
    else
      self.avatar_slug = Game::ALL_AVATARS.sample
    end
  end

  def color
    avatar_slug.split("_").last
  end

  def character
    avatar_slug.split("_").first
  end

  def info
    {
      id: self.id,
      avatar: self.avatar_slug,
      game_id: self.game.id
    }
  end
end
