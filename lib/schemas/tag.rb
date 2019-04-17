module Schemas
  class Tag < Schemas::Base
    SCHEMA = {
      'type' => 'object',
      'required' => %w[
        id
        name
        shared_object_id
      ].freeze,
      'properties' => {
        'id' => {
          'type' => 'string'
        }.freeze,
        'shared_object_id' => {
          'type' => 'string'
        }.freeze,
        'name' => {
          'type' => 'string'
        }
      }.freeze
    }.freeze

    private

    def schema
      SCHEMA
    end
  end
end
