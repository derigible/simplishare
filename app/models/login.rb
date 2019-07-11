# frozen_string_literal: true

class Login < ApplicationRecord
  belongs_to :user, inverse_of: :logins

  def self.login(auth_hash)
    where(provider: auth_hash.provider, uid: auth_hash.uid).includes(:user).take&.user
  end
end
