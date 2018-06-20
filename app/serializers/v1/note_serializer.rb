module V1
  class NoteSerializer < ActiveModel::Serializer
    attributes :id, :created_at, :updated_at
    attribute :tags do
      object.tag_ids
    end
    attribute :title do
      object.data['title']
    end
    attribute :body do
      object.data['body']
    end
  end
end
