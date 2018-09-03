# frozen_string_literal: true

class VirtualEntity < ApplicationRecord
  belongs_to :user
  belongs_to :entity
  belongs_to :todo, foreign_key: :entity_id, optional: true
  belongs_to :note, foreign_key: :entity_id, optional: true

  has_many :virtual_entities_tags, dependent: :delete_all
  has_many :virtual_tags, through: :virtual_entities_tags
  has_many :tags, through: :virtual_tags

  def owner_ve?
    shared_on.nil?
  end

  Entity.subclasses.map do |entity|
    scope_name = entity.name.downcase.pluralize.to_sym
    scope scope_name, ->(user_id) do
      includes(:entity).where(entities: { type: entity.name }, virtual_entities: { user_id: user_id })
    end
  end
end
