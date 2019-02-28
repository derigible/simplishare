module Factories
  module Concerns
    module VirtualEntityFactory
      def add_user(action: :create!,  entity:, user: nil, overrides: {})
        params = {
          user: user,
          entity: entity
        }.merge(overrides)
        VirtualEntity.send(action, params)
      end
    end
  end
end
