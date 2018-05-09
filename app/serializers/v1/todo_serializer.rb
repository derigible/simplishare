module V1
  # We flatten out the object to hide jsonb implementation details.
  # Consumers should act like the top level todo is a first class
  # citizen in this datamodel.
  class TodoSerializer < ActiveModel::Serializer
    attribute :id do
      object.id.to_s
    end
    attribute :description do
      object.todo['description']
    end
    attribute :priority do
      object.todo['priority']
    end
    attribute :todos do
      object.todo['todos']
    end
    attribute :title do
      object.todo['title']
    end
    attribute :completed do
      object.todo['completed']
    end
    attribute :updated_at do
      object.updated_at
    end
    attribute :created_at do
      object.created_at
    end
  end
end
