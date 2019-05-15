module Schemas
  class Todo < Schemas::Base
    SCHEMA = {
      'type' => 'object',
      'required' => %w[
        title
        description
      ].freeze,
      'properties' => {
        'title' => {
          'type' => 'string'
        }.freeze,
        'description' => {
          'type' => %w[string null]
        }.freeze
      }.freeze
    }.freeze

    private

    def schema
      Schemas::VirtualEntity.merge_schema(SCHEMA)
    end
  end
end
