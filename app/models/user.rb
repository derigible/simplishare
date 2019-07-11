# frozen_string_literal: true

class User < ApplicationRecord
  include HtmlSanitizer
  include Preferences

  # # Include default devise modules. Others available are:
  # # :lockable, :timeoutable and :omniauthable
  # devise :database_authenticatable, :registerable,
  #   :recoverable, :rememberable, :trackable, :validatable,
  #   :confirmable

  has_one_attached :csv_uploads
  has_many :virtual_entities, class_name: 'VirtualEntity', inverse_of: :user, dependent: :destroy
  has_many :entities, through: :virtual_entities
  has_many :todos, through: :virtual_entities
  has_many :notes, through: :virtual_entities
  has_many :logins, inverse_of: :user, dependent: :destroy
  has_many :password_logins, dependent: :destroy

  validates :email, presence: true

  before_save :run_sanitizers
  before_create :prepopulate_preference_hash

  def contacts
    Contact.where('user_id = ? OR contact_id = ?', id, id)
  end

  def contacts_with_objects
    contacts.eager_load(:user).select('users.email')
  end

  def pending_invitations
    contacts.where(authorized_on: nil).where.not(rejected_on: nil)
  end

  # for internal use only. Rejected invitations should not be shown to users
  def rejected_invitations
    contacts.where(rejected_on: nil)
  end

  def shared_contacts(user)
    contact_ids = shared_contacts_ids(user)
    shared = contacts.to_a.select { |c| contact_ids.include?(c.user_id) || contact_ids.include?(c.contact_id) }
    make_ready_for_serialization shared
  end

  def shared_contacts_ids(user)
    user.contacts.pluck(:user_id, :contact_id).flatten.uniq.reject do |shared_contact_id|
      [id, user.id].include? shared_contact_id
    end
  end

  def contacts_for_serialization
    make_ready_for_serialization contacts_with_objects
  end

  def upload_events
    CsvImporter.new(self, csv_uploads.read).import
  end

  def self.authenticate(email, password)
    user = User.find_for_authentication(email: email)
    user&.valid_password?(password) && user&.active_for_authentication? ? user : nil
  end

  def send_confirmation_notification?
    false
  end

  private

  def run_sanitizers
    html_sanitize(%i[email])
  end

  def make_ready_for_serialization(contacts)
    contacts.map do |contact|
      email = retrieve_contact_email(contact)
      Contact.new(
        contact_id: retrieve_contact_id(contact),
        created_at: contact.created_at,
        invitation_sent_to: email,
        id: contact.id
      )
    end
  end

  def retrieve_contact_email(contact)
    if contact.authorized_on.blank?
      contact.invitation_sent_to
    elsif contact.user_id == id
      contact.contact.email
    else
      contact.user.email
    end
  end

  def retrieve_contact_id(contact)
    if contact.user_id == id
      contact.contact_id
    elsif contact.authorized_on.present?
      contact.user_id
    else
      0
    end
  end
end
