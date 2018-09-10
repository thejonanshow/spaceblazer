Thread.new do
  redis = Redis.new(url: ENV['REDIS_URL'])

  redis.subscribe(ENV["REDIS_CHANNEL"]) do |on|
    on.message do |channel, message|
      ActionCable.server.broadcast("commands", message)
    end
  end
end
