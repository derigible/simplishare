# frozen_string_literal: true

class User < ApplicationRecord
  include Rails.application.routes.url_helpers
  include HtmlSanitizer
  include Preferences

  # # Include default devise modules. Others available are:
  # # :lockable, :timeoutable
  # devise :rememberable

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

  def send_confirmation_notification?
    false
  end

  def locked?
    if locked_at.present?
      unlock! if Time.zone.now - locked_at > Rails.configuration.x.pinkairship.unlock_after_time
    end
    locked_at.present?
  end

  def unlock_time_elapsed?
    Rails.configuration.x.pinkairship.unlock_after_time > Time.zone.now - locked_at
  end

  def track_failed_attempt
    update!(failed_attempts: id)
  end

  def track_failed_attempt_and_check_if_should_lock
    track_failed_attempt
    failed_attempts > Rails.configuration.x.pinkairship.lock_after_attempts
  end

  def unlock!
    update!(locked_at: nil, failed_attempts: 0, unlock_token: nil)
  end

  def lock!
    update!(locked_at: Time.zone.now, unlock_token: SecureRandom.uuid)
    UserMailer.with(self, unlock_url).unlock.deliver_now
  end

  private

  def unlock_url
    "#{unlock_email_users_url}?unlock_token=#{unlock_token}"
  end

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
