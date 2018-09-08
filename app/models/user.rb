# frozen_string_literal: true

class User < ApplicationRecord
  include HtmlSanitizer

  # Include default devise modules. Others available are:
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :trackable, :validatable,
    :confirmable

  has_one_attached :csv_uploads
  has_many :virtual_entities, class_name: 'VirtualEntity', inverse_of: :user, dependent: :destroy
  has_many :entities, through: :virtual_entities
  has_many :todos, through: :virtual_entities
  has_many :notes, through: :virtual_entities

  validates :email, presence: true
  validates :username, presence: true

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
    contact_ids = user.contacts.pluck(:user_id, :contact_id).flatten.uniq.reject { |i| i == id || i == user.id }
    shared = contacts.to_a.select { |c| contact_ids.include?(c.user_id) || contact_ids.include?(c.contact_id) }
    make_ready_for_serialization shared
  end

  def contacts_for_serialization
    make_ready_for_serialization contacts_with_objects
  end

  before_save :run_sanitizers

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
    html_sanitize(%i[email full_name username])
  end

  def make_ready_for_serialization(contacts)
    contacts.map do |contact|
      c_id = contact.user_id == id ? contact.contact_id : contact.user_id
      c_id = 0 if contact.authorized_on.blank?
      email = if contact.authorized_on.blank?
                contact.invitation_sent_to
              elsif contact.user_id == id
                contact.contact.email
              else
                contact.user.email
      end
      Contact.new(
        contact_id: c_id,
        created_at: contact.created_at,
        invitation_sent_to: email,
        id: contact.id
      )
    end
  end
end
