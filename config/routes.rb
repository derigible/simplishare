Budgetr::Application.routes.draw do
  concern :api_routes do
    post 'account/token' => "custom_tokens#create"
    post 'account/revoke' => "custom_tokens#revoke"

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
