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

      # overrides are the same as for entity (to pass in specific virtual_object
      # overrides you must include that in the hash as virtual_object: <overrides>)
      def virtual_object(action: :create!, overrides: {})
        entity(action: action, overrides: overrides, return_vo: true).second
      end
    end
  end
end
