class AdministrationController < ApplicationController
  include Devise::Controllers::Helpers
  self.responder = Concerns::Responder
  respond_to :json
end
