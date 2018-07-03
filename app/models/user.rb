class User < ApplicationRecord
  include HtmlSanitizer

  # Include default devise modules. Others available are:
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :trackable, :validatable,
    :confirmable

  has_one_attached :csv_uploads
  has_many :virtual_entities, class_name: 'VirtualEntity'
  has_many :entities, through: :virtual_entities
  has_many :todos, through: :virtual_entities
  has_many :notes, through: :virtual_entities

  before_save :run_sanitizers

  def upload_events
    CsvImporter.new(self, csv_uploads.read).import
  end

  def self.authenticate(email, password)
    user = User.find_for_authentication(email: email)
    user&.valid_password?(password) && user.active_for_authentication? ? user : nil
  end

  def send_confirmation_notification?
    false
  end

  private

  def run_sanitizers
    html_sanitize(%i[email full_name given_name])
  end
end
