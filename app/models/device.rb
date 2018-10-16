class Device < ApplicationRecord
  validates :external_id, presence: true, uniqueness: true
  validates :online, presence: true

  def self.broadcast_to_all(data)
    Device.where(online: true).each do |device|
      DevicesChannel.broadcast_to(device, data)
    end
  end
end
