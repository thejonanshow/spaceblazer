class DevicesChannel < ApplicationCable::Channel
  def subscribed
    current_device.send_game_info
    stream_for current_device
  end

  def unsubscribed
    current_device.update(online: false)
  end
end
