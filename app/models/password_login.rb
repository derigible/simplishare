# frozen_string_literal: true

class PasswordLogin < OmniAuth::Identity::Models::ActiveRecord
  include Rails.application.routes.url_helpers

  self.table_name = Login.table_name
  auth_key('identifier')
  has_secure_password

  belongs_to :user, optional: true

  after_create :set_uid

  class << self
    def create(params)
      email = params[:email]
      user = find_or_create_user(params)
      create_attrs = params.merge(
        provider: 'identity',
        identifier: params.fetch(:identifier, email),
        uid: email,
        email: email,
        user: user,
        name: "#{params[:first_name]} - #{params[:last_name]}"
      )
      if params[:nickname].present?
        create_username_login(create_attrs)
      else
        create_attrs[:confirmation_token] = SecureRandom.uuid
      end
      l = super(create_attrs)
      # only send if this is the email login being created
      l.send_login_confirmation if params[:identifier].blank?
      l
    end

    private

    def find_or_create_user(params)
      return params[:user] if params[:user].present?
      email = params[:email]
      u = User.find_by(email: email)
      u = User.create(email: email) if u.blank?
      u
    end

    def create_username_login(create_attrs)
      new_login = create_attrs.except(:nickname)
      create(new_login.merge(identifier: create_attrs[:nickname]))
    end
  end

  def send_login_confirmation
    update!(confirmation_sent_at: Time.zone.now)
    UserMailer.with(user: self, url: url).welcome_email.deliver_now
  end

  private

  def set_uid
    update!(uid: id.to_s)
  end

  def confirmation_url
    "#{confirm_email_logins_url}?confirmation_token=#{@user.confirmation_token}"
  end
end
