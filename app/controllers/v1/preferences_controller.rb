# frozen_string_literal: true

module V1
  class PreferencesController < ApiController
    def update
      skip_authorization
      current_user.update_preference(**preferences_params.to_h.symbolize_keys)
      respond_with current_user, serializer: UserSerializer
    end

    def show
      skip_authorization
      respond_with current_user, serializer: UserSerializer
    end

    private

    def preferences_params
      params.require(:preferences).permit(:record_type, :action, :preference_type, :preference)
    end
  end
end
