class Laserbonnet < ApplicationRecord
  def self.register(pi_id)
    laserbonnet = Laserbonnet.first_or_create(pi_id: pi_id)
    laserbonnet.update(online: true)
  end

  def self.offline(pi_id)
    laserbonnet.update(online: false)
  end
end
