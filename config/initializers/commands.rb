Thread.report_on_exception = true
last_message = nil

def add_ip(ip)
  existing = [Rails.configuration.action_cable.allowed_request_origins].flatten
  Rails.configuration.action_cable.allowed_request_origins = (existing + [ip]).flatten
end

Thread.new do
  redis = Redis.new(url: ENV['REDIS_URL'])

  redis.subscribe(ENV["REDIS_CHANNEL"]) do |on|
    on.message do |channel, message|
      Rails.logger.debug { message } if ENV["LOG_COMMANDS"]

      if (message.match /My voice is my passport, verify me/)
        ip = message.split(':').last.strip
        add_ip(ip)
        Rails.logger.debug("#{ip} added to action cable allowed request origins.")
      elsif message == last_message
        Rails.logger.debug { "Duplicate message received" } if ENV["LOG_COMMANDS"]
      else
        Rails.logger.debug { "Not a duplicate: #{message} != #{last_message}" } if ENV["LOG_COMMANDS"]
        ActionCable.server.broadcast("commands", message)
        last_message = message
      end
    end
  end
end
