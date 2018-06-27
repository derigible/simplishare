class ConfirmationsController < Devise::ConfirmationsController
  respond_to :json

  def confirm
    self.resource = resource_class.confirm_by_token(params[:confirmation_token])
    render text: 'Thank you for confirming your email.'
  end
end
