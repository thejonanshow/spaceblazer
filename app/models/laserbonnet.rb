class Laserbonnet < ApplicationRecord
  def register(pi_id)
    laserbonnet = Laserbonnet.first_or_create(pi_id: pi_id)
    laserbonnet.update(online: true)
  end
end
