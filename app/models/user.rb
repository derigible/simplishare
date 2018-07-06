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

  def contacts
    Contact.where('user_id = ? OR contact_id = ?', self.id, self.id)
  end

  def contacts_with_objects
    contacts.eager_load(:users).select('users.email')
  end

  def pending_invitations
    contacts.where(authorized_on: nil).where.not(rejected_on: nil)
  end

  # for internal use only. Rejected invitations should not be shown to users
  def rejected_invitations
    contacts.where(rejected_on: nil)
  end

  def contacts_for_serialization
    contacts.map do |contact|
      c = contact.user_id == self.id ? contact.contact_id : contact.user_id
      c = 'pending' if contact.authorized_on.blank?
      email = contact.authorized_on.blank? ? contact.invitation_sent_to : contact.contact.email
      OpenStruct.new(
        contact_id: c,
        created_at: contact.created_at,
        email: email,
        id: contact.id
      )
    end
  end

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
