module ApplicationCable
  class Connection < ActionCable::Connection::Base
    def connect
      logger.add_tags 'ActionCable', current_device.id
    end

    protected

    def current_device
      Device.find_or_create_by(external_id: request.params[:device_id])
    end

    def current_display
      Display.find_or_create_by(external_id: request.params[:device_id])
    end
  end
end
