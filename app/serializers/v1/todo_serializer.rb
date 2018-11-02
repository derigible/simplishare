# frozen_string_literal: true

module V1
  # We flatten out the object to hide jsonb implementation details.
  # Consumers should act like the top level todo is a first class
  # citizen in this datamodel.
  class TodoSerializer < VirtualEntitySerializer
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
    attribute :archived do
      object.entity.archived || object.archived
    end
    attribute :updated_at do
      object.entity.updated_at
    end
    attribute :created_at do
      object.entity.created_at
    end
  end
end
