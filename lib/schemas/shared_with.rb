# frozen_string_literal: true

module Schemas
  class SharedWith < Schemas::Base
    SCHEMA = {
      'type' => 'object',
      'required' => %w[
        id
        email
        permissions
        owner
      ].freeze,
      'properties' => {
        'id' => {
          'type' => 'string'
        }.freeze,
        'email' => {
          'type' => 'string'
        }.freeze,
        'owner' => {
          'type' => 'boolean'
        }.freeze,
        'permissions' => {
          'type' => 'array',
          'items' => {
            'type' => 'string',
            'enum' => %w[read edit destroy share owner].freeze
          }
        }
      }.freeze
    }.freeze

    private

    def schema
      Schemas::VirtualEntity.merge_schema(SCHEMA)
    end
  end
end
