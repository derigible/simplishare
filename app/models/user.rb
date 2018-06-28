class User < ApplicationRecord
  include HtmlSanitizer

  # Include default devise modules. Others available are:
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :trackable, :validatable,
    :confirmable

  has_one_attached :csv_uploads

  before_save :run_sanitizers

  def upload_events
    CsvImporter.new(self, csv_uploads.read).import
  end

  def self.authenticate(email, password)
    user = User.find_for_authentication(email: email)
    user&.valid_password?(password) && user.active_for_authentication? ? user : nil
  end

  private

  def run_sanitizers
    html_sanitize(%i[email full_name given_name])
  end
end
