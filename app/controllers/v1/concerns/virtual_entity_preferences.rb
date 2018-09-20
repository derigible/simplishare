# frozen_string_literal: true

module V1
  module Concerns
    module VirtualEntityPermissions
      def preferences
        ve = VirtualEntity.find params[:id]
        authorize(ve)
        ve.update_preferences preferences_params
        respond_with ve, serializer: serializer
      end

      def preferences_params
        params.require(:preferences).permit(record_type, action, preference_type, preference)
      end
      private_class_method :preferences_params
    end
  end
end
