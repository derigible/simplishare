Rails.application.routes.draw do
  health_check_routes

  get 'auth/failure', to: 'authentications#failure'
  get 'auth/:provider/callback', to: 'authentications#login'
  post 'auth/:provider/callback', to: 'authentications#login'
  delete 'logout' => 'authentications#logout'
  post 'forgot_password' => 'users#forgot_password'
  post 'reset_password' => 'users#reset_password'

  resources :users, only: [:create, :show] do
    get 'info', on: :collection
    get 'authorize_contact', on: :collection
    get 'unlock', on: :collection
  end

  resources :logins do
    get 'resend_confirmation', on: :collection, action: 'begin_resend_confirmation'
    post 'resend_confirmation', on: :collection
    get 'confirm_email', on: :collection
    get 'forgot_password', on: :collection, action: 'begin_forgot_password'
    post 'forgot_password', on: :collection
    get 'reset_password', on: :collection, action: 'begin_reset_password'
    post 'reset_password', on: :collection
  end

  concern :virtual_entity do
    post 'share', on: :member
    delete 'share', on: :member, action: 'unshare'
    get 'shared_with', on: :member
    get 'shareable_with', on: :member
    put 'preferences', on: :member
    put 'snooze', on: :member
    delete 'snooze', on: :member
    put 'archive', on: :member
    delete 'archive', on: :member
    post 'tag', on: :member
    delete 'tag', on: :member, action: 'untag'
  end

  concern :api_routes do
    resources :contacts, only: [:index, :create, :show, :destroy]
    resources :notifications, only: [:index, :create, :show, :destroy]
    resources :notes do
      concerns :virtual_entity
    end
    resources :todos do
      concerns :virtual_entity
    end
    resources :tags
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
