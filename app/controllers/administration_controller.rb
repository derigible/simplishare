class AdministrationController < ApplicationController
  include Devise::Controllers::Helpers
  self.responder = Responsibilities::Responder
  respond_to :json
end
