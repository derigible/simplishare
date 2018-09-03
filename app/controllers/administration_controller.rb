# frozen_string_literal: true

class AdministrationController < ApplicationController
  include Devise::Controllers::Helpers
  self.responder = Delegates::Responder
  respond_to :json
end
