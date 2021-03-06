# frozen_string_literal: true

module Factories
  class NoteFactory
    class << self
      include Factories::Concerns::VirtualEntityFactory

      def entity(action: :create!, attach_user: true, overrides: {}, return_vo: false)
        params = {
          type: 'Note',
          priority: 'medium',
          data: {
            title: Faker::Hipster.sentence,
            body: Faker::Hipster.paragraph
          }
        }.merge(overrides.except(:virtual_object))
        e = Note.send(action, params)
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
