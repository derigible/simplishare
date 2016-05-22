FactoryGirl.define do
  factory :'oauth/access_token' do
    association :resource_owner, factory: :user

    expires_in Doorkeeper.configuration.access_token_expires_in
  end
end
