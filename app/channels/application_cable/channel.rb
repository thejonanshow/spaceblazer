module ApplicationCable
  class Channel < ActionCable::Channel::Base
    protected

    def current_device
      Device.find_or_create_by(external_id: params[:device_id])
    end

    def current_display
      Display.find_or_create_by(external_id: params[:device_id])
    end
  end
end
