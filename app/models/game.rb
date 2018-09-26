class Game < ApplicationRecord
  validates :start, uniqueness: true
  validates :finish, uniqueness: true
  has_many :players

  PLAYER_ANIMATION_FILES = Dir.glob("./app/assets/javascripts/game/animations/players/*.json")
  AVATARS = PLAYER_ANIMATION_FILES.map { |f| f.scan(/\/(\w+)\.json/) }.flatten

  def self.current
    Game.where(finish: nil).first || Game.create
  end

  def start
    Device.broadcast_to_all({ start_game: self.id });
  end

  def stop
    Device.broadcast_to_all({ finish_game: self.id });
  end

  def random_avatar
    AVATARS.sample
  end

  def random_color
    COLORS.sample
  end

  def self.fetch_game(requester_id)
    Device.find_or_create_by(external_id: requester_id).send_game_info
  end

  def self.finish_game(params)
    game = Game.current
    game.update(
      data: params[:game_data],
      finish: DateTime.now
    )
    Device
  end

  def self.add_player(player_id)
    self.current.add_player(player_id)
  end

  def new_player?(player_id)
    existing_ids = players.reload.map(&:client_side_id)

    if existing_ids.include? player_id
      Rails.logger.debug("Player ID already exists: #{player_id} (existing: #{existing_ids})")
      return false
    else
      Rails.logger.debug("Player ID is new: #{player_id} (existing: #{existing_ids})")
      return true
    end
  end

  def add_player(player_id)
    return unless new_player?(player_id)

    avatar = random_avatar
    color = random_color

    while self.players.where(avatar: avatar, color: color).any?
      avatar = random_avatar
      color = random_color
      break if players.length >=(AVATARS.length * COLORS.length)
    end

    players.create(avatar: avatar, color: color, client_side_id: player_id)
  end

  def assigned_avatars
    players.map { |p| p.avatar }
  end

  def assigned_colors
    players.map { |p| p.color }
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
end
