module V1
  class BaseSerializer < ActiveModel::Serializer
    # Turn off the root
    # https://github.com/rails-api/active_model_serializers#3-subclass-the-serializer-and-specify-using-it
    self.root = false

    def initialize(object, options={})
      super
      @options = options[:serializer_options] || {}
    end
  end
end
