# frozen_string_literal: true

module V1
  class ApiController < ActionController::API
    include Pundit
    include Rails::Pagination
    include Pagy::Backend

    self.responder = Delegates::Responder
    respond_to :json

    rescue_from ActionController::BadRequest do |e|
      error_render(e, :bad_request)
    end

    rescue_from ActionController::ParameterMissing do |e|
      error_render(e, :bad_request)
    end

    rescue_from ActiveRecord::RecordNotFound do |e|
      error_render(e, :not_found)
    end

    rescue_from ActiveRecord::RecordInvalid do |e|
      error_render(e, :unprocessable_entity)
    end

    rescue_from Pundit::NotAuthorizedError do |e|
      # Override the error message to something we can return to the client
      policy_name = e.policy.class.to_s.underscore
      error = Exception.new message: "Unauthorized access for #{policy_name}.#{e.query}"
      error_render(error, :forbidden)
    end

    rescue_from BaseFilter::InvalidLookupTermError do |e|
      error_render(e, :bad_request)
    end

    rescue_from BaseFilter::InvalidLookupParamError do |e|
      error_render(e, :bad_request)
    end

    after_action :verify_authorized, except: :index
    after_action :verify_policy_scoped, only: :index

    before_action :authenticate_user!

    def authenticate_user!
      @_current_user = User.find_by(
        id: JSON::JWT.decode(
          request.headers['Authorization'].split(' ').last, Delegates::AuthenticationMethods.public_key
        )['sub']
      )
      error = Exception.new 'User is not authenticated.'
      error_render error, :unauthorized if current_user.blank?
    end

    def current_user
      @_current_user
    end

    def pundit_user
      current_user
    end

    protected

    # Set the timezone from the doorkeeper user.
    def in_user_timezone(&block)
      if current_user
        Time.use_zone(current_user.timezone, &block)
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
# loading order problems with STI in controllers, this should
# prevent this being an issue
require_dependency Rails.root.join('app/models/virtual_entity')
