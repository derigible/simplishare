module V1
  module Detailed
    class EventSerializer < V1::EventSerializer
      attribute :accounts do
        object.events_accounts.map(&:account_id)
      end
      attribute :categories do
        object.events_categories.map(&:category_id)
      end
    end
  end
end
