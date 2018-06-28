class ApplicationController < ActionController::API
  include Rails::Pagination
  include Devise::Controllers::Helpers
end
