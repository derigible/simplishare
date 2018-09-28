# frozen_string_literal: true

module V1
  class VirtualEntitySerializer < ActiveModel::Serializer
    attribute :id do
      object.id.to_s
    end
    attribute :tags do
      object.virtual_tag_ids
    end
    attribute :shared_on
    attribute :shared do
      object.metadata['shared'] || false
    end
    attribute :metadata
    attribute :preferences
    attribute :shared_object_id do
      object.entity.id
    end
  end
end
