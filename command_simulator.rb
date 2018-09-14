require 'redis'
require 'dotenv'
require 'json'

Dotenv.load

redis = Redis.new(url: ENV["REDIS_URL"])
puts "Connected to #{ENV['REDIS_URL']} on channel #{ENV['REDIS_CHANNEL']}"

command = nil

ids = (0..1000).to_a

id_mode = true
while command != 'q'
  if id_mode
    puts "IDs are unique"
  else
    puts "IDs are NOT unique"
  end

  puts "Enter a command (toggle id (m)ode, (q)uit):"
  command = gets.chomp

  if command == 'm'
    id_mode = !id_mode
    next
  end

  redis.publish(ENV['REDIS_CHANNEL'], { id: "simulator#{id_mode ? ids.shift : ''}", command: command }.to_json)
end
