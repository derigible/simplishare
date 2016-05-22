class AccessTokenSeeder
  class << self
    def default_params(email)
      {
        email: email,
        password: 'password',
        password_confirmation: 'password',
        reset_password_token: nil,
        reset_password_sent_at: nil,
        remember_created_at: nil,
        sign_in_count: 0,
        current_sign_in_at: nil,
        last_sign_in_at: nil,
        current_sign_in_ip: nil,
        last_sign_in_ip: nil
      }
    end

    def oauth_app
      @_oauth_application ||= Oauth::Application.find_by(
        uid: 'b74af67b3a8b4145bb3d71971eaef44792eb98072b0f49b9a581fe7238e9bf34',
        secret: 'ba575a2ddede4eac908e73e6d7df553eacb840fcba144438a200f4107650dbb9'
      )
    end

    def make_access_token(user)
      debugger
      Oauth::AccessToken.find_or_create_by(application_id: oauth_app.id, resource_owner_id: user.id) do
        scopes = Doorkeeper.configuration.default_scopes
        expires_in = nil
      end
    end

    def message(tokens)
      "ADMIN_TOKEN: #{tokens[0]}"
    end

    def admin
      @_admin ||= User.create!(default_params('admin@instructure.com'))
      # admin.add_role(:admin) # currently don't have roles set up
      @_admin
    end

    def users_to_grant_tokens
      [admin]
    end

    def create_token(user)
      access_token = make_access_token(user)
      access_token.save!
      access_token.token
    end

    def seed_users
      tokens = users_to_grant_tokens.map do |user|
        create_token(user)
      end

      File.open('seeded_access_tokens', 'w+') do |f|
        f.write(message(tokens))
      end
    end
  end
end

AccessTokenSeeder.seed_users
