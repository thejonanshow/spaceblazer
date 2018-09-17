class ActionCableClient
  REDIS_KEY = 'connected_clients'

  def self.redis
    @redis ||= ::Redis.new(url: ENV["REDIS_URL"])
  end

  def self.all
    redis.lrange(REDIS_KEY, 0, -1)
  end

  def self.count
    redis.llen(REDIS_KEY)
  end

  def self.unique
    ActionCableClient.all.uniq.count
  end

  def self.clear_all
    redis.del(REDIS_KEY)
  end

  def self.add(uid)
    redis.rpush(REDIS_KEY, uid)
  end

  def self.include?(uid)
    ActionCableClient.all.include? uid
  end

  def self.remove(uid)
    redis.lrem(REDIS_KEY, 1, uid)
  end
end
