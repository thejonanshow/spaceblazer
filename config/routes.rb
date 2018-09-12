Rails.application.routes.draw do
  namespace :admin do
    root to: 'dashboard#index'
    get 'dashboard/start'
  end

  root to: 'welcome#index'
  mount ActionCable.server => '/cable'
end
