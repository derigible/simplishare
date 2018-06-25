class User < ApplicationRecord
  include HtmlSanitizer

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :trackable, :validatable

  # Relationships
  has_many :access_tokens, class_name: 'Oauth::AccessToken',
                           dependent: :delete_all,
                           foreign_key: :resource_owner_id

  has_one_attached :csv_uploads

  before_save :run_sanitizers

  def upload_events
    CsvImporter.new(self, csv_uploads.read).import
  end

  private

  def run_sanitizers
    html_sanitize(%i[email full_name given_name])
  end
end
