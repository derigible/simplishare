Rails.application.routes.draw do
  health_check_routes

  post 'login' => 'sessions#login'
  post 'logout' => 'sessions#logout'
  get 'confirm_email' => 'confirmations#confirm'

  concern :api_routes do
    resources :users, only: [:create] do
      post 'resend_confirmation', on: :member
    end

    resources :categories do
      resources :events, only: [:index], controller: 'categories/events'
    end
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
    end
    resources :todos do
      resource :tags, only: [:create, :destroy], controller: 'tags/todos'
    end
    resources :tags
  end

  api_version(
    module: 'v1',
    header: { name: 'Accept', value: 'application/vnd.budgetr.v1' },
    parameter: { name: 'version', value: '1' },
    default: true
  ) do
    concerns :api_routes
  end
end
