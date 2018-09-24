class DevicesChannel < ApplicationCable::Channel
  def subscribed
    stream_for current_device
  end

  def unsubscribed
    current_device.update(online: false)
  end
end
