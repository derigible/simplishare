# frozen_string_literal: true

module V1
  class CategorySerializer < ActiveModel::Serializer
    attributes :id, :title
  end
end
