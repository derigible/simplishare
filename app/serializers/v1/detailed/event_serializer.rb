# frozen_string_literal: true

module V1
  module Detailed
    class EventSerializer < V1::EventSerializer
      attribute :accounts do
        object.accounts.pluck(:account_id)
      end
      attribute :categories do
        object.categories.pluck(:category_id)
      end
    end
  end
end
