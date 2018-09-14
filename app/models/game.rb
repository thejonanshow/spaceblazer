class Game < ApplicationRecord
  after_create :set_data

  PLAYER_ANIMATION_FILES = Dir.glob("./app/assets/javascripts/game/animations/players/*.json")
  AVATARS = PLAYER_ANIMATION_FILES.map { |f| f.scan(/\/(\w+)\.json/) }.flatten

  def self.current
    Game.where(active: true).first || Game.create(active: true)
  end

  def set_data
    self.data = {}
    save
  end

  def start
    ActionCable.server.broadcast("commands", { id: "system", command: "start_game" }.to_json)
  end

  def stop
    ActionCable.server.broadcast("commands", { id: "system", command: "stop_game" }.to_json)
  end

  def random_avatar
    available = (AVATARS - self.assigned_avatars)
    self.assigned_avatars = [] if available.empty?
    (AVATARS - self.assigned_avatars).sample
  end

  def random_color
    available = (COLORS - self.assigned_colors)
    self.assigned_colors = [] if available.empty?
    (COLORS - self.assigned_colors).sample
  end

  def self.add_player(player_id)
    self.current.add_player(player_id)
  end

  def add_player(player_id)
    avatar = random_avatar
    color = random_color

    while self.players.keys.include? "#{avatar}_#{color}"
      avatar = random_avatar
      color = random_color
      break if players.length >=(AVATARS.length * COLORS.length)
    end

    self.assigned_avatars.push avatar
    self.assigned_colors.push color
    self.players["#{avatar}_#{color}"] = player_id

    message = {
      id: "system",
      player_created: { id: player_id, avatar: "#{avatar}_#{color}", game_id: self.id }
    }
    ActionCable.server.broadcast("commands", message.to_json)

    self.save

    if self.players.length > 4
      start
    end
  end

  def players
    if data["players"].nil?
      data["players"] = {}
      self.save
    end

    data["players"]
  end

  def assigned_avatars
    if data["assigned_avatars"].nil?
      data["assigned_avatars"] = []
      self.save
    end

    data["assigned_avatars"]
  end

  def assigned_avatars=(new_avatars)
    data["assigned_avatars"] = new_avatars
    self.save
  end

  def assigned_colors
    if data["assigned_colors"].nil?
      data["assigned_colors"] = []
      self.save
    end

    data["assigned_colors"]
  end

  def assigned_colors=(new_colors)
    data["assigned_colors"] = new_colors
    self.save
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
