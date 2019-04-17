# frozen_string_literal: true

module Factories
  class TagFactory
    class << self
      include Factories::Concerns::VirtualTagFactory

      def entity(action: :create!, attach_user: true, overrides: {}, return_vo: false)
        params = {
          name: Faker.name
        }.merge(overrides.except(:virtual_object))
        e = Tag.send(action, params)
        if attach_user
          opts = overrides.fetch(:virtual_object, {})
          ve = add_user(
            action: action,
            entity: e,
            user: opts[:user],
            overrides: opts
          )
        end
        attach_user && return_vo ? [e, ve] : e
      end
    end
  end
end
