Rails.application.routes.draw do
  health_check_routes

  post 'login' => 'authentications#login'
  delete 'logout' => 'authentications#logout'
  post 'forgot_password' => 'users#forgot_password'
  post 'reset_password' => 'users#reset_password'

  resources :users, only: [:create, :show] do
    post 'resend_confirmation', on: :collection
    get 'confirm_email', on: :collection
    get 'authorize_contact', on: :collection
  end

  concern :virtual_entity do
    post 'share', on: :member
    get 'shared_with', on: :member
    get 'shareable_with', on: :member
    put 'preferences', on: :member
    put 'snooze', on: :member
    put 'archive', on: :member
  end

  concern :api_routes do
    resources :categories do
      resources :events, only: [:index], controller: 'categories/events'
    end
    resources :contacts, only: [:index, :create, :show, :destroy]
    resources :accounts do
      resources :events, only: [:index], controller: 'accounts/events'
    end
    post 'events/bulk_create' => 'events#bulk_create'
    resources :events do
      resources :accounts, only: [:index, :create], controller: 'events/accounts'
      resources :categories, only: [:index, :create], controller: 'events/categories'
    end
    resources :notes do
      resource :tags, only: [:create, :destroy], controller: 'tags/notes'
      concerns :virtual_entity
    end
    resources :todos do
      resource :tags, only: [:create, :destroy], controller: 'tags/todos'
      concerns :virtual_entity
    end
    resources :tags
    resource :preferences, only: [:update, :show]
  end

  api_version(
    module: 'v1',
    header: { name: 'Accept', value: 'application/vnd.pinkairship.v1' },
    parameter: { name: 'version', value: '1' },
    default: true
  ) do
    concerns :api_routes
  end
end
