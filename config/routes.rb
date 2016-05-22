Budgetr::Application.routes.draw do
  use_doorkeeper do
    skip_controllers :authorized_applications, :token_info, :authorizations, :tokens
  end
  devise_for :users

  concern :api_routes do
    get 'account/token/info' => 'token_info#show'
    post 'account/token' => 'custom_tokens#create'
    post 'account/revoke' => 'custom_tokens#revoke'

    resources(
      :event_account_link,
      path: 'events/:event_id/accounts/:account_id',
      only: [:create]
    )

    resources(
      :event_account_link,
      path: 'events/:event_id/accounts',
      only: [:destroy]
    )

    resources(
      :event_category_link,
      path: 'events/:event_id/categories/:category_id',
      only: [:create]
    )

    resources(
      :event_category_link,
      path: 'events/:event_id/categories',
      only: [:destroy]
    )

    resources :categories
    resources :accounts

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
