# frozen_string_literal: true

class VirtualEntity < ApplicationRecord
  PERMISSIONS = %w[read edit destroy share].freeze
  belongs_to :user
  belongs_to :entity
  belongs_to :todo, foreign_key: :entity_id, optional: true
  belongs_to :note, foreign_key: :entity_id, optional: true

  has_many :virtual_entities_tags, dependent: :delete_all
  has_many :virtual_tags, through: :virtual_entities_tags
  has_many :tags, through: :virtual_tags

  validate :validate_correct_permissions

  def owner_ve?
    shared_on.nil?
  end

  Entity.subclasses.map do |entity|
    scope_name = entity.name.downcase.pluralize.to_sym
    scope scope_name, ->(user_id) do
      includes(:entity).where(entities: { type: entity.name }, virtual_entities: { user_id: user_id })
    end
  end

  private

  def validate_correct_permissions
    metadata.fetch('permissions', []).each do |perm|
      next if PERMISSIONS.include? perm
      errors.add(
        :metadata,
        "Available permissions does not include requeste permission #{perm}."
      )
    end
  end
end
