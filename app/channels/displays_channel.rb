class DisplaysChannel < ApplicationCable::Channel
  def subscribed
    Rails.logger.debug("DisplaysChannel#subscribed #{current_display}")
    stream_for current_display
    current_display.send_game_info
    current_display.update(online: true)
  end

  def unsubscribed
    current_device.update(online: false)
  end
end
