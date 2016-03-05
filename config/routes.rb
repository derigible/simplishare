Budgetr::Application.routes.draw do
  concern :api_routes do
    post 'account/token' => "custom_tokens#create"
    post 'account/revoke' => "custom_tokens#revoke"

    resources :accounts do
      resources :transaction_events, only: [:index, :create], controller: 'accounts_transaction_events'
    end

    resources(
      :account_transaction_event_link,
      path: 'accounts/:account_id/transaction_events/:transaction_event_id',
      only: [:create]
    )

    resources(
      :account_transaction_event_link,
      path: 'accounts/:account_id/transaction_events',
      only: [:destroy]
    )

    resources :transaction_events
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
