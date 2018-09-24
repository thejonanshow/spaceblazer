module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_device

    def connect
      self.device = current_device
      logger.add_tags 'ActionCable', self.device.id
    end

    protected

    def current_device
      Device.find_or_create(device_id: params[:device_id])
    end
  end
end
