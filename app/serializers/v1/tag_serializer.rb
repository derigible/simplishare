# frozen_string_literal: true

module V1
  class TagSerializer < ActiveModel::Serializer
    attribute :id
    attribute :name do
      object.tag.name
    end
    attribute :metadata do
      object.metadata
    end
    attribute :shared_object_id do
      object.tag.id
    end
  end
end
