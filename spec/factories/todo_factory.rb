# frozen_string_literal: true

module Factories
  class TodoFactory
    class << self
      include Factories::Concerns::VirtualEntityFactory

      def entity(action: :create!, attach_user: true, overrides: {}, return_vo: false)
        params = {
          type: 'Todo',
          priority: 'medium',
          data: {
            title: Faker::Hipster.sentence,
            todos: []
          }
        }.merge(overrides.except(:virtual_object))
        e = Todo.send(action, params)
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

      def sub_task(overrides = {})
        {
          id: SecureRandom.uuid,
          title: Faker::Hipster.sentence,
          created_at: Time.zone.now,
          updated_at: Time.zone.now
        }.merge(overrides)
      end
    end
  end
end
