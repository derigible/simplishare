# frozen_string_literal: true

module V1
  class NoteSerializer < ActiveModel::Serializer
    attribute :id
    attribute :created_at do
      object.entity.created_at
    end
    attribute :updated_at do
      object.entity.updated_at
    end
    attribute :tags do
      object.virtual_tag_ids
    end
    attribute :title do
      object.entity.data['title']
    end
    attribute :body do
      object.entity.data['body']
    end
    attribute :shared_object_id do
      object.entity.id
    end
  end
end
