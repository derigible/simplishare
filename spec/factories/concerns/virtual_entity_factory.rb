module Factories
  module Concerns
    module VirtualEntityFactory
      def add_user(action: :create!, entity:, user: nil, overrides: {})
        params = {
          user: user,
          entity: entity
        }.merge(overrides)
        VirtualEntity.send(action, params)
      end

      # overrides are the same as for entity (to pass in specific virtual_entity
      # overrides you must include that in the hash as virtual_entity: <overrides>)
      def virtual_entity(action: :create!, overrides: {})
        entity(action: action, overrides: overrides, return_ve: true).second
      end
    end
  end
end
