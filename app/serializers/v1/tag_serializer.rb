# frozen_string_literal: true

module V1
  class TagSerializer < ActiveModel::Serializer
    attribute :id do
      object.id.to_s
    end
    attribute :name do
      object.tag.name
    end
    attribute :shared_object_id do
      object.tag.id.to_s
    end
  end
end
