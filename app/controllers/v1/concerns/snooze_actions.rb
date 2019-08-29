# frozen_string_literal: true

module V1
  module Concerns
    module SnoozeActions
      extend ActiveSupport::Concern

      def snooze
        authorize(ve)
        ve.update(post? ? snooze_params : nil)
        ve.save
        respond_with ve, serializer: serializer
      end

      private

      def snooze_params
        params.require(:snooze).permit(:snooze_until)
      end

      def post?
        request.method == 'POST'
      end
    end
  end
end
