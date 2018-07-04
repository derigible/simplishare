module V1
  class NoteSerializer < ActiveModel::Serializer
    attribute :id
    attribute :created_at do
      object.note.created_at
    end
    attribute :updated_at do
      object.note.updated_at
    end
    attribute :tags do
      object.tag_ids
    end
    attribute :title do
      object.note.data['title']
    end
    attribute :body do
      object.note.data['body']
    end
    attribute :shared_object_id do
      object.note.id
    end
  end
end
