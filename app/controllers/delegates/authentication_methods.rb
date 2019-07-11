# frozen_string_literal: true

module Delegates
  class AuthenticationMethods
    class << self
      def authenticate(auth_hash)
        if auth_hash.provider == 'identity'
          PasswordLogin.authenticate(auth_hash)
        else
          Login.authenticate(auth_hash)
        end
      end

      def private_key
        signing_key
      end

      delegate :public_key, to: :signing_key

      private

      def signing_key
        @signing_key ||= begin
          jwk_s = JSON.parse(Rails.application.secrets.auth_jwk)
          jwk = JSON::JWK.new jwk_s
          jwk.to_key
        end
      end
    end
  end
end
