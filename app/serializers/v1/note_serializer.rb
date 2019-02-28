# frozen_string_literal: true

module V1
  class NoteSerializer < VirtualEntitySerializer
    attribute :title do
      object.entity.data['title']
    end
    attribute :body do
      object.entity.data['body']
    end
  end
end
