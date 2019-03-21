# frozen_string_literal: true

class VirtualEntity < ApplicationRecord
  include Preferences

  PERMISSIONS = %w[archive read edit destroy share owner].freeze
  belongs_to :user
  belongs_to :entity
  belongs_to :todo, foreign_key: :entity_id, optional: true
  belongs_to :note, foreign_key: :entity_id, optional: true

  has_many :virtual_entities_tags, dependent: :delete_all
  has_many :virtual_tags, through: :virtual_entities_tags
  has_many :tags, through: :virtual_tags

  before_validation :ensure_permissions_exist
  before_validation :ensure_read_if_other_permissions_exist

  validate :validate_correct_permissions

  before_create :prepopulate_preference_hash

  scope :unsnoozed, -> { where('snooze_until < ?', Time.zone.now).or(where(snooze_until: nil)) }
  scope :archived, -> { where(archived: true) }
  scope :unarchived, -> { where(archived: [false, nil]) }

  def owner_ve?
    shared_on.nil?
  end

  Entity.subclasses.map do |entity|
    scope_name = entity.name.downcase.pluralize.to_sym
    scope scope_name, ->(user_id) do
      includes(:entity).where(entities: { type: entity.name }, virtual_entities: { user_id: user_id })
    end
  end

  def permissions
    metadata['permissions']
  end

  def permissions=(perms)
    metadata['permissions'] = perms
  end

  def permission?(perm)
    permissions.include? perm
  end

  def archive!
    update!(archived: true)
  end

  private

  def ensure_permissions_exist
    return unless permissions.nil?
    perms = shared_on.nil? ? ['owner'] : []
    self.permissions = perms
  end

  def ensure_read_if_other_permissions_exist
    return if permissions.empty? || permissions.include?('read') || permissions.include?('owner')
    self.permissions += ['read']
  end

  def validate_correct_permissions
    metadata.fetch('permissions', []).each do |perm|
      next if PERMISSIONS.include? perm
      errors.add(
        :metadata,
        "Available permissions does not include requested permission #{perm}."
      )
    end
  end
end
