class ApplicationController < ActionController::API
  include Rails::Pagination
  include Devise::Controllers::Helpers

  before_action :retrieve_session

  def retrieve_session

  end
end
