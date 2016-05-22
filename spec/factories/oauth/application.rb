FactoryGirl.define do
  factory :'oauth/application' do
    name { Faker::App.name }
    redirect_uri 'https://www.example.com/launch'
    secret { Faker::Hipster.words.join('-') }
    uid { SecureRandom.uuid }
  end
end
