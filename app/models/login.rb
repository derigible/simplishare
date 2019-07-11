# frozen_string_literal: true

class Login < ApplicationRecord
  belongs_to :user, inverse_of: :logins

  class << self
    def login(auth_hash)
      where(provider: auth_hash.provider, uid: auth_hash.uid).includes(:user).take
    end

    def confirm(confirmation_token)
      l = find_by(confirmation_token: confirmation_token)
      l.update!(confirmed_at: Time.zone.now) if l&.waiting_confirmation?
      l
    end

    def reset_password(params)
      l = find_by(reset_password_token)
      l&.update!(
        password: params[:password], password_confirmation: params[:password_confirmation]
      )
      l
    end
  end

  def waiting_confirmation?
    # this should not be true for all logins not made by identity
    confirmed_at.blank?
  end

  def set_reset_password_token
    token = SecureRandom.uuid
    update! reset_password_token: token, reset_password_sent_at: Time.zone.now
    token
  end
end
