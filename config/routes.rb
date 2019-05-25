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
    delete 'share', on: :member, action: 'unshare'
    get 'shared_with', on: :member
    get 'shareable_with', on: :member
    put 'preferences', on: :member
    put 'snooze', on: :member
    delete 'snooze', on: :member, action: 'unsnooze' #create action
    put 'archive', on: :member
    delete 'archive', on: :member, action: 'unarchive' #create action
    post 'tag', on: :member #create action
    delete 'tag', on: :member, action: 'untag' #create action
  end

  concern :api_routes do
    resources :contacts, only: [:index, :create, :show, :destroy]
    resources :notes do
      resource :tags, only: [:create, :destroy], controller: 'tags/notes' #deprecate!
      concerns :virtual_entity
    end
    resources :todos do
      resource :tags, only: [:create, :destroy], controller: 'tags/todos' #deprecate!
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
