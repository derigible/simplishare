# frozen_string_literal: true

module Schemas
  class Contact < Schemas::Base
    SCHEMA = {
      'type' => 'object',
      'required' => %w[
        body
      ].freeze,
      'properties' => {
        'title' => {
          'type' => %w[string null]
        }.freeze,
        'body' => {
          'type' => 'string'
        }.freeze
      }.freeze
    }.freeze

    private

    def schema
      Schemas::VirtualEntity.merge_schema(SCHEMA)
    end
  end
end
