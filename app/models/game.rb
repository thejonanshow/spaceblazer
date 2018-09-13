class Game
  def self.start
    ActionCable.server.broadcast("commands", { id: "system", command: "start" }.to_json)
  end

  def self.add_player(id)
    # when a controller connects it sends "online"
    # we choose a random avatar and add it to our sorted set as "avatar_id&id"
    # then tell clients to make a new player with that avatar and id
    # when new clients connect they get the new player list and create all the players
    # their positions are ordered by the UI
  end

  def self.players
    # return sorted list for player creation
    # ["astro_blue", "hootie_red", "astro_green"]
    # clients create players in order at predetermined positions
  end
end
