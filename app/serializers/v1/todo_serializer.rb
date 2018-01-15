module V1
  class TodoSerializer < ActiveModel::Serializer
    attributes :id, :description, :priority, :todos, :title, :updated_at, :created_at
  end
end
