# frozen_string_literal: true

module V1
  # We flatten out the object to hide jsonb implementation details.
  # Consumers should act like the top level todo is a first class
  # citizen in this datamodel.
  class TodoSerializer < VirtualEntitySerializer
    attribute :description do
      object.entity.todo['description']
    end
    attribute :title do
      object.entity.todo['title']
    end
  end
end
