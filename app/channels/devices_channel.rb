class DevicesChannel < ApplicationCable::Channel
  def subscribed
    Rails.logger.debug("DevicesChannel#subscribed #{current_device}")
    stream_for current_device
    current_device.update(online: true)
  end

  def unsubscribed
    current_device.update(online: false)
  end
end
