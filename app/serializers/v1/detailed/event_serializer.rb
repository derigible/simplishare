module V1
  module Detailed
    class EventSerializer < V1::EventSerializer
      has_many :categories, serializer: V1::CategorySerializer
      has_many :accounts, serializer: V1::AccountSerializer
    end
  end
end
