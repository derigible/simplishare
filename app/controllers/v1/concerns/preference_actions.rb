# frozen_string_literal: true

module V1
  module Concerns
    module PreferenceActions
      def preferences
        authorize(ve)
        ve.update_preference(**preferences_params.to_h.symbolize_keys)
        respond_with ve, serializer: serializer
      end

      private

      def preferences_params
        params.require(:preference).permit(:record_type, :action, :preference_type, :preference)
      end
    end
  end
end
