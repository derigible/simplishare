module V1
  class ApiController < ApplicationController
    self.responder = Responder
    respond_to :json

    def error_render(error, status)
      render json: { error: error.message }, status: status
    end

    rescue_from ActionController::ParameterMissing do |e|
      error_render(e, :bad_request)
    end

    rescue_from ActiveRecord::RecordNotFound do |e|
      error_render(e, :not_found)
    end

    # Turn off CSRF token authentication - because that's what this API is designed for
    skip_before_filter :verify_authenticity_token

    ## == Notifications

    def current_resource_owner
      User.find(doorkeeper_token.resource_owner_id) if doorkeeper_token
    end

    protected

    # Override the base method
    # Set the user timezone from the doorkeeper user.
    def set_user_timezone(&block)
      if current_resource_owner
        Time.use_zone(current_resource_owner.timezone, &block)
      else
        yield
      end
    end
  end
end
