module V1
  class ApiController < ::ApplicationController
    self.responder = ::Responder
    respond_to :json

    rescue_from ActionController::ParameterMissing do |e|
      error_render(e, :bad_request)
    end

    rescue_from ActiveRecord::RecordNotFound do |e|
      error_render(e, :not_found)
    end

    rescue_from ActiveRecord::RecordInvalid do |e|
      error_render(e, :unprocessable_entity)
    end

    rescue_from JWT::ExpiredSignature do |e|
      error_render(e, :unauthorized)
    end

    # Turn off CSRF token authentication - because that's what this API is designed for
    skip_before_action :verify_authenticity_token
    # prepend_before_action -> { doorkeeper_authorize! :api }

    def current_resource_owner
      @_current_resource_owner ||= User.find(doorkeeper_token.resource_owner_id)
    end

    protected

    # Set the timezone from the doorkeeper user.
    def in_user_timezone(&block)
      if current_resource_owner
        Time.use_zone(current_resource_owner.timezone, &block)
      else
        yield
      end
    end

    private

    def error_render(error, status)
      render json: { error: error.message }, status: status
    end
  end
end
