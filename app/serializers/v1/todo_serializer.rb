# frozen_string_literal: true

module V1
  # We flatten out the object to hide jsonb implementation details.
  # Consumers should act like the top level todo is a first class
  # citizen in this datamodel.
  class TodoSerializer < ActiveModel::Serializer
    attribute :id do
      object.id.to_s
    end
    attribute :description do
      object.entity.todo['description']
    end
    attribute :priority do
      object.entity.priority
    end
    attribute :todos do
      object.entity.todo['todos']
    end
    attribute :title do
      object.entity.todo['title']
    end
    attribute :completed do
      object.entity.archived || object.archived
    end
    attribute :updated_at do
      object.entity.updated_at
    end
    attribute :created_at do
      object.entity.created_at
    end
    attribute :tags do
      object.virtual_tag_ids
    end
    attribute :shared_on
    attribute :shared do
      object.metadata['shared'] || false
    end
    attribute :metadata
    attribute :preferences
    attribute :shared_object_id do
      object.entity.id
    end
  end
end
