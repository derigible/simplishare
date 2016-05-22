module Oauth
  class AccessToken < Doorkeeper::AccessToken
    belongs_to :resource_owner, class_name: 'User'
  end
end
