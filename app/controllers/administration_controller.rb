# frozen_string_literal: true

class AdministrationController < ApplicationController
  self.responder = Delegates::Responder
  respond_to :json

  rescue_from JSON::JWT::Exception do |e|
    error_render(e, :unauthorized)
  end

  private

  def error_render(error, status)
    render json: { error: error.message }, status: status
  end
end
