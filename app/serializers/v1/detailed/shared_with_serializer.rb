# frozen_string_literal: true

module V1
  module Detailed
    class SharedWithSerializer < V1::SharedWithSerializer
      attribute :owner do
        object.owner_ve?
      end
    end
  end
end
