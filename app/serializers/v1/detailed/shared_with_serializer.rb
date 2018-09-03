# frozen_string_literal: true

module V1
  module Detailed
    class SharedWithSerializer < V1::SharedWithSerializer
      attribute :share_restricted do
        true
      end
      attribute :owner do
        object.owner_ve?
      end
    end
  end
end
