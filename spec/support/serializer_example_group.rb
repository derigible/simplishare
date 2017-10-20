module SerializerExampleGroup
  module Helper
    extend ActiveSupport::Concern

    included do
      let(:to_serialize) {}
      let(:serializer) { described_class }

      let(:serializable_resource) do
        unless serializer <= ActiveModel::Serializer
          raise 'serializer must be defined for the resource being tested'
        end
        ActiveModel::SerializableResource.new(
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
