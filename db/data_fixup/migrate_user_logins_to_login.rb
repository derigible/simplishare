module DataFixup
  module MigrateUserLoginsToLogin
    class User < ActiveRecord::Base
    end

    class Login < ActiveRecord::Base
    end

    class << self
      def run
        generate_logins
      end

      private

      def generate_logins
        User.all.each do |u|
          create_params = {
            identifier: u.email,
            provider: 'identity',
            uid: u.email,
            email: u.email,
            name: u.email,
            nickname: u.username,
            reset_password_sent_at: u.reset_password_sent_at,
            remember_created_at: u.remember_created_at,
            confirmed_at: u.confirmed_at,
            confirmation_sent_at: u.confirmation_sent_at,
            password_digest: u.encrypted_password,
            user_id: u.id
          }
          Login.create(create_params)
          Login.create(create_params.merge(identifier: u.username))
        end
      end
    end
  end
end
