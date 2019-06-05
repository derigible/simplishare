# frozen_string_literal: true

module Schemas
  class Contact < Schemas::Base
    SCHEMA = {
      'type' => 'object',
      'required' => %w[
        id
        created_at
        contact_id
        email
      ].freeze,
      'properties' => {
        'id' => {
          'type' => 'string'
        }.freeze,
        'created_at' => {
          'type' => 'string'
        }.freeze,
        'contact_id' => {
          'type' => 'string'
        }.freeze,
        'email' => {
          'type' => 'string'
        }.freeze
      }.freeze
    }.freeze

    private

    def schema
      SCHEMA
    end
  end
end
