# frozen_string_literal: true

module V1
  module Concerns
    module ShowAction
      extend ActiveSupport::Concern

      def show
        authorize(ve)
        respond_with ve, serializer: serializer
      end
    end
  end
end
