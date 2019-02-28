# frozen_string_literal: true

module Factories
  class NoteFactory
    class << self
      include Factories::Concerns::VirtualEntityFactory

      def entity(action: :create!, attach_user: true, overrides: {})
        params = {
          type: 'Note',
          priority: 'medium',
          data: {
            title: Faker::Hipster.sentence,
            body: Faker::Hipster.paragraph
          }
        }.merge(overrides.except(:virtual_entity))
        e = Note.send(action, params)
        if attach_user
          opts = overrides.fetch(:virtual_entity, {})
          add_user(
            action: action,
            entity: e,
            user: opts[:user],
            overrides: opts
          )
        end
        e
      end
    end
  end
end
