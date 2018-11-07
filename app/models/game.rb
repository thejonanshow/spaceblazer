class Game < ApplicationRecord
  validates :start, uniqueness: true
  validates :finish, uniqueness: true
  has_many :players

  PLAYER_ANIMATION_FILES = Dir.glob("./app/assets/javascripts/game/animations/players/*.json")
  CHARACTERS = PLAYER_ANIMATION_FILES.map { |f| f.scan(/\/(\w+)\.json/) }.flatten

  def self.current
    Game.where(finish: nil).first || Game.create
  end

  def self.fetch_game(requester_id)
    Device.find_or_create_by(external_id: requester_id).send_game_info
  end

  def self.add_player(player_id)
    self.current.add_player(player_id)
  end

  def self.get_colors
    JSON.parse(File.read(Game::PLAYER_ANIMATION_FILES.first))["anims"].map do |anim|
      anim["frames"]
    end.flatten.map do |f|
      f["frame"]
    end.map do |path|
      path.split("_").last[0..-2]
    end.uniq
  end
  COLORS = Game.get_colors

  def self.get_avatars
    Game::CHARACTERS.map do |character|
      Game::COLORS.map do |color|
        "#{character}_#{color}"
      end
    end.flatten
  end
  ALL_AVATARS = Game.get_avatars

  def self.start_game
    Game.current.update(
      start: DateTime.now
    )
    Device.broadcast_to_all({ start_game: Game.current.id });
  end

  def self.finish_game(params)
    Game.current.update(
      data: params["game_data"],
      finish: DateTime.now
    )
    Device.broadcast_to_all({ finish_game: Game.current.id });
  end

  def new_player?(external_id)
    existing_ids = players.map(&:client_side_id)

    if existing_ids.include? player_id
      Rails.logger.debug("Player ID already exists: #{player_id} (existing: #{existing_ids})")
      return false
    else
      Rails.logger.debug("Player ID is new: #{player_id} (existing: #{existing_ids})")
      return true
    end
  end

  def add_player(external_id)
    return unless new_player?(external_id)
    players.create(avatar: avatar, color: color, client_side_id: external_id)
  end
end
