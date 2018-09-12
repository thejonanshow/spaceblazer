module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :uid

    def connect
      self.uid = get_connecting_uid
      logger.add_tags 'ActionCable', uid
    end

    protected

    def get_connecting_uid
      request.params[:uid] if request.params[:uid]
    end
  end
end
