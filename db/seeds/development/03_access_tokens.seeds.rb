oauth_application = Oauth::Application.find_by(
  uid: '14c414cdb2b0b9ee739cf20f46d15d1a666cab6a678a821009b1b8f9b7c3aa33',
  secret: '05a4f0cae8c1c4be3788cc232d63d3ece7f5b8afc5ad8f6a45262b0d8763a216'
)

token_descriptions = []

3.times do |n|
  user = User.create!(
    email: "user#{n}@igibl.com",
    password: 'password',
    password_confirmation: 'password'
  )
  access_token = Oauth::AccessToken.create!(
    application_id: oauth_application.id,
    resource_owner_id: user.id,
    scopes: Doorkeeper.configuration.default_scopes,
    expires_in: nil
  )
  token_descriptions.push "token#{n}: #{access_token.token}"
end

File.open('seeded_access_tokens', 'w+') do |f|
  token_descriptions.each { |description| f.puts description }
end
