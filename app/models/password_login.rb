# frozen_string_literal: true

class PasswordLogin < OmniAuth::Identity::Models::ActiveRecord
  self.table_name = Login.table_name
  auth_key('identifier')
  has_secure_password

  belongs_to :user, optional: true

  after_create :set_uid

  def self.create(params)
    email = params[:email]
    user = User.create! email: email, username: email.split('@').first
    create_attrs = params.merge(
      provider: 'identity',
      email: email,
      user: user
    )
    super(create_attrs)
  end

  private

  def set_uid
    update!(uid: id.to_s)
  end
end
