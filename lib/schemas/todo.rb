module Schemas
  class Todo < Schemas::Base
    SCHEMA = {
      'type' => 'object',
      'required' => %w[
        title
        description
        todos
      ].freeze,
      'properties' => {
        'title' => {
          'type' => 'string'
        }.freeze,
        'description' => {
          'type' => %w[string null]
        }.freeze,
        'todos' => {
          'type' => 'array',
          'id' => 'sub_todo',
          'items' => {
            'type' => 'object',
            'required' => %w[
              id
              title
              todos
            ],
            'properties' => {
              'id' => {
                'type' => 'string'
              },
              'title' => {
                'type' => 'string'
              },
              'todos' => {
                'type' => 'array',
                '$ref' => 'sub_todo'
              },
              'description' => {
                'type' => %w[string null]
              }
            }
          }
        }.freeze
      }.freeze
    }.freeze

    private

    def schema
      Schemas::VirtualEntity.merge_schema(SCHEMA)
    end
  end
end
