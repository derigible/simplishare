# frozen_string_literal: true

module SerializerExampleGroup
  module Helper
    extend ActiveSupport::Concern

    included do
      let(:to_serialize) {}
      let(:serializer) { described_class }

      let(:serializable_resource) do
        raise 'serializer must be defined for the resource being tested' unless serializer <= ActiveModel::Serializer
        ActiveModelSerializers::SerializableResource.new(
          to_serialize, serializer: serializer
        )
      end
    end
  end

  extend ActiveSupport::Concern

  included do
    include Helper
    metadata[:type] = :serializer
    subject { serializable_resource.as_json }
  end

  RSpec.configure do |config|
    config.include self, type: :serializer, file_path: %r{spec/serializers}
  end
end
