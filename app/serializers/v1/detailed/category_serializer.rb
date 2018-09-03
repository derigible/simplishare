# frozen_string_literal: true

module V1
  module Detailed
    class CategorySerializer < V1::CategorySerializer
      has_many :events, serializer: V1::EventSerializer
    end
  end
end
