Rails.application.routes.draw do
  get 'todo/index'

  root to: 'home#index'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace :api do
    namespace :todo do
      get '/', action: 'index'
      post '/', action: 'create'
      get '/:id', action: 'show'
      patch '/:id', action: 'update'
      delete '/:id', action: 'destroy'
    end
  end
end
