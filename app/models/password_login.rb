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
        name: preferred_name(params),
        confirmation_token: SecureRandom.uuid
      )
      if params[:nickname].present?
        create_username_login(create_attrs)
      end
      login = super(create_attrs)
      # only send if this is the email login being created
      login.send_login_confirmation if params[:identifier].blank? && login.valid?
      login
    end

    private

    def find_or_create_user(params)
      return params[:user] if params[:user].present?
      email = params[:email]
      user = User.find_by(email: email)
      user = User.create(email: email, preferred_name: preferred_name(params)) if user.blank?
      user
    end

    def create_username_login(create_attrs)
      new_login = create_attrs.except(:nickname)
      create(new_login.merge(identifier: create_attrs[:nickname]))
    end

    def preferred_name(params)
      if params[:first_name].present?
        "#{params[:first_name]} - #{params[:last_name]}" if params[:last_name].present?
        params[:first_name]
      elsif params[:last_name].present?
        params[:last_name]
      elsif params[:nickname].present?
        params[:nickname]
      else
        params[:email]
      end
    end
  end

  def send_login_confirmation
    update!(confirmation_sent_at: Time.zone.now)
    reload
    UserMailer.with(user: self, url: confirmation_url).welcome_email.deliver_now
  end

  def authenticate(password, skip_track: false)
    return super(password) if skip_track
    return false if user.locked?
    authenticated = super(password)
    user.lock! if !authenticated && user.track_failed_attempt_and_check_if_should_lock
    authenticated
  end

  private

  def set_uid
    update!(uid: id.to_s)
  end

  def confirmation_url
    "#{confirm_email_logins_url}?confirmation_token=#{confirmation_token}"
  end
end
