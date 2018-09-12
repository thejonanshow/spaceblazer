class Admin::DashboardController < ApplicationController
  def index
  end

  def start
    Game.start
    redirect_to admin_dashboard_index_path
  end
end
