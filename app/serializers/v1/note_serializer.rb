module V1
  class NoteSerializer < ActiveModel::Serializer
    attributes :id, :title, :body, :created_at, :updated_at
    attribute :tags do
      object.tag_ids
    end
  end
end
