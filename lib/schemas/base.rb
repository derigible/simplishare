# frozen_string_literal: true

module Schemas
  class Base
    delegate :validate, :valid?, to: :schema_checker

    def self.simple_validation_errors(json_hash)
      error = new.validate(json_hash).to_a.first
      return nil if error.blank?
      return ["#{error['data']} #{error['data_pointer']}. Schema: #{error['schema']}"] if error['data_pointer'].present?
      error.dig('schema', 'required')
    end

    private

    def schema_checker
      @schema_checker ||= JSONSchemer.schema(schema)
    end

    def schema
      raise 'Abstract method'
    end
  end
end
