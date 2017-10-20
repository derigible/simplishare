module V1
  module Detailed
    class AccountSerializer < V1::AccountSerializer
      has_many :events, serializer: V1::EventSerializer
    end
  end
end
