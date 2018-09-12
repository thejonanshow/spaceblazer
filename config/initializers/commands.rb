last_message = nil

Thread.new do
  redis = Redis.new(url: ENV['REDIS_URL'])

  redis.subscribe(ENV["REDIS_CHANNEL"]) do |on|
    on.message do |channel, message|
      Rails.logger.debug { message } if ENV["LOG_COMMANDS"]

      if message == last_message
        Rails.logger.debug { "Duplicate message received" } if ENV["LOG_COMMANDS"]
      else
        Rails.logger.debug { "Not a duplicate: #{message} != #{last_message}" } if ENV["LOG_COMMANDS"]
        ActionCable.server.broadcast("commands", message)
        last_message = message
      end
    end
  end
end
