Budgetr::Application.routes.draw do
  concern :api_routes do
    post 'account/token' => "custom_tokens#create"
    post 'account/revoke' => "custom_tokens#revoke"

    resources :accounts do
      resources :events, only: [:index, :create], controller: 'accounts_events'
    end

    resources(
      :account_event_link,
      path: 'accounts/:account_id/events/:event_id',
      only: [:create]
    )

    resources(
      :account_event_link,
      path: 'accounts/:account_id/events',
      only: [:destroy]
    )

    resources(
      :category_event_link,
      path: 'categories/:category_id/events/:event_id',
      only: [:create]
    )

    resources(
      :category_event_link,
      path: 'categories/:category_id/events',
      only: [:destroy]
    )

    resources :categories

    resources :events do
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
