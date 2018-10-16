module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_device

    def connect
      logger.add_tags 'ActionCable', current_device.id
    end

    protected

    def current_device
      Device.find_or_create_by(external_id: request.params[:device_id])
    end
  end
end
