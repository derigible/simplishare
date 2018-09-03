# frozen_string_literal: true

module V1
  module Detailed
    class EventSerializer < V1::EventSerializer
      attribute :accounts do
        object.events_accounts.pluck(:account_id)
      end
      attribute :categories do
        object.events_categories.pluck(:category_id)
      end
    end
  end
end
