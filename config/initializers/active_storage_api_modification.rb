Doorkeeper::OAuth::Token.class_eval do
  def from_x_csrf_token_header(request)
    request.parameters['X-CSRF-Token']
  end
end

ActiveStorage::DirectUploadsController.class_eval do
  def check_authorization
    doorkeeper_authorize!
  end
end

ActiveStorage::DirectUploadsController.instance_eval do
  skip_forgery_protection
  before_action :check_authorization
end
