Rails.application.routes.draw do
  use_doorkeeper do
    skip_controllers :authorized_applications, :token_info, :authorizations, :tokens
  end

  concern :api_routes do
    get 'account/token/info' => 'token_info#show'
    post 'account/token' => 'custom_tokens#create'
    post 'account/revoke' => 'custom_tokens#revoke'

    resources :users, only: [:create]

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
