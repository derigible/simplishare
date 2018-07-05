module Responsibilities
  class AuthenticationMethods
    class << self
      def private_key
        signing_key
      end

      def public_key
        signing_key.public_key
      end

      private

      def signing_key
        @_signing_key ||= begin
          jwk_s = JSON.parse(Rails.application.secrets.auth_jwk)
          jwk = JSON::JWK.new jwk_s
          jwk.to_key
        end
      end
    end
  end
end
