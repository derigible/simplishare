# frozen_string_literal: true

class Entity < ApplicationRecord
  PRIORITY_TYPES = %w[low medium high].freeze
  has_many :virtual_entities, dependent: :destroy
  has_many :users, through: :virtual_entities

  validates :data, presence: true
  validate :validate_type_unchanged, on: [:update]
  validate :priority_exists_and_correct
  validate :data_is_hash

  scope :unarchived, -> { where(archived: [fals, nil]) }
  scope :archived, -> { where(archived: true) }

  def shared_with_except_users(except_users)
    virtual_entities.where.not(user: except_users).includes(:user)
  end

  def owner
    @owner ||= owner_ve.user
  end

  def owner_ve
    @owner_ve ||= virtual_entities.find_by(shared_on: nil)
  end

  def archive!
    update!(archived: true)
  end

  # TODO: add validations

  private

  def validate_type_unchanged
    errors.add(:base, 'cannot change type') if type_changed?
  end

  def data_is_hash
    errors.add(:data, 'Data must be a hash') unless data.is_a? Hash
  end

  def priority_exists_and_correct
    if priority.blank?
      errors.add(:base, 'Priority cannot be blank.')
    elsif !possible_priorities.include? priority
      errors.add(:base, "Priority must be one of #{possible_priorities.join(',')}")
    end
  end

  def possible_priorities
    PRIORITY_TYPES
  end
end
require_dependency 'entities/todo'
require_dependency 'entities/note'
