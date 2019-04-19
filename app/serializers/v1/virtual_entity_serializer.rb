# frozen_string_literal: true

module V1
  class VirtualEntitySerializer < ActiveModel::Serializer
    attribute :id do
      object.id.to_s
    end
    attribute :archived do
      object.entity.archived || object.archived
    end
    attribute :tags do
      object.virtual_tag_ids.map(&:to_s)
    end
    attribute :shared_on
    attribute :shared do
      object.metadata['shared'] || false
    end
    attribute :metadata
    attribute :preferences
    attribute :shared_object_id do
      object.entity.id.to_s
    end
    attribute :updated_at do
      object.entity.updated_at
    end
    attribute :created_at do
      object.entity.created_at
    end
    attribute :priority do
      object.entity.priority
    end
  end
end
