module Schemas
  class VirtualEntity
    SCHEMA = {
      'type' => 'object',
      'required' => %w[
        id
        tags
        shared_on
        shared
        metadata
        preferences
        shared_object_id
        priority
        archived
      ].freeze,
      'properties' => {
        'id' => {
          'type' => 'string'
        }.freeze,
        'tags' => {
          'type' => 'array',
          'items' => {
            'type' => 'string'
          }
        }.freeze,
        'shared_on' => {
          'type' => %w[string null]
        }.freeze,
        'shared' => {
          'type' => 'boolean'
        }.freeze,
        'metadata' => {
          'type' => 'object',
          'required' => %w[permissions],
          'properties' => {
            'permissions' => {
              'type' => 'array',
              'items' => {
                'type' => 'string',
                'enum' => %w[read edit destroy share owner].freeze
              }
            }
          }
        }.freeze,
        'preferences' => {
          'type' => 'object',
          'required' => %w[email],
          'properties' => {
            'email' => {
              'type' => 'object'
            }
          }
        }.freeze,
        'shared_object_id' => {
          'type' => 'string'
        }.freeze,
        'priority' => {
          'type' => 'string',
          'enum' => %w[low medium high].freeze
        }.freeze,
        'archived' => {
          'type' => %w[boolean null]
        }.freeze,
        'updated_at' => {
          'type' => 'string'
        },
        'created_at' => {
          'type' => 'string'
        }
      }.freeze
    }.freeze

    def self.merge_schema(schema)
      SCHEMA.merge(
        'required' => SCHEMA['required'] + schema['required'],
        'properties' => SCHEMA['properties'].merge(schema['properties'])
      )
    end
  end
end
