module V1
  # We flatten out the object to hide jsonb implementation details.
  # Consumers should act like the top level todo is a first class
  # citizen in this datamodel.
  class TodoSerializer < ActiveModel::Serializer
    attribute :id do
      object.id.to_s
    end
    attribute :description do
      object.todo.todo['description']
    end
    attribute :priority do
      object.todo.todo['priority']
    end
    attribute :todos do
      object.todo.todo['todos']
    end
    attribute :title do
      object.todo.todo['title']
    end
    attribute :completed do
      object.todo.todo['completed']
    end
    attribute :updated_at do
      object.todo.updated_at
    end
    attribute :created_at do
      object.todo.created_at
    end
    attribute :tags do
      object.virtual_tag_ids
    end
    attribute :shared_on
    attribute :metadata
    attribute :shared_object_id do
      object.todo.id
    end
  end
end
