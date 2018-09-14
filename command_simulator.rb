require 'redis'
require 'dotenv'
require 'json'

Dotenv.load

redis = Redis.new(url: ENV["REDIS_URL"])
puts "Connected to #{ENV['REDIS_URL']} on channel #{ENV['REDIS_CHANNEL']}"

command = nil

while command != 'q'
  puts "Enter a command or (q)uit:"
  command = gets.chomp
  redis.publish(ENV['REDIS_CHANNEL'], { id: 'simulator', command: command }.to_json)
end
