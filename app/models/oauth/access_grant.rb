module Oauth
  class AccessGrant < Doorkeeper::AccessGrant
    belongs_to :resource_owner, class_name: 'User'
  end
end
