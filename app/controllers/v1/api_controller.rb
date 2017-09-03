module V1
  class ApiController < ::ApplicationController
    include Pundit
    include ApiPagination

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

    rescue_from Pundit::NotAuthorizedError do |e|
      # Override the error message to something we can return to the client
      policy_name = e.policy.class.to_s.underscore
      error = Exception.new message: "Unauthorized access for #{policy_name}.#{e.query}"
      error_render(error, :forbidden)
    end

    rescue_from DateFilterService::InvalidLookupTermError do |e|
      error_render(e, :bad_request)
    end

    rescue_from DateFilterService::InvalidLookupParamError do |e|
      error_render(e, :bad_request)
    end

    after_action :verify_authorized, except: :index
    after_action :verify_policy_scoped, only: :index

    # Turn off CSRF token authentication - because that's what this API is designed for
    skip_before_action :verify_authenticity_token
    prepend_before_action -> { doorkeeper_authorize! :api unless skip_authorization }

    def skip_authorization
      params[:controller] == 'v1/users' && params[:action] == 'create'
    end

    def current_resource_owner
      @_current_resource_owner ||= User.find(doorkeeper_token&.resource_owner_id) unless skip_authorization
    end

    def pundit_user
      current_resource_owner
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
