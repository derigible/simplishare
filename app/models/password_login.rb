# frozen_string_literal: true

class PasswordLogin < OmniAuth::Identity::Models::ActiveRecord
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
      create_username_login(create_attrs) if params[:nickname].present?
      super(create_attrs)
    end

    private

    def find_or_create_user(params)
      return params[:user] if params[:user].present?
      email = params[:email]
      u = User.find_by(email: email)
      u = User.create(email: email, username: params.fetch(:nickname, email.split('@').first)) if u.blank?
      u
    end

    def create_username_login(create_attrs)
      new_login = create_attrs.except(:nickname)
      create(new_login.merge(identifier: create_attrs[:nickname]))
    end
  end

  private

  def set_uid
    update!(uid: id.to_s)
  end
end
