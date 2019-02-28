# frozen_string_literal: true

module V1
  class NoteSerializer < VirtualEntitySerializer
    attribute :tags do
      object.virtual_tag_ids
    end
    attribute :title do
      object.entity.data['title']
    end
    attribute :body do
      object.entity.data['body']
    end
    attribute :archived do
      object.entity.archived || object.archived
    end
  end
end
