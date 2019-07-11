# frozen_string_literal: true

class LoginsController < AdministrationController
  def resend_confirmation
    # check user creds
    # do confirm email stuff here if valid
  end

  def confirm_email
    @login = Login.confirm(params[:confirmation_token])
  end

  def forgot_password
    @login = Login.find_by identifier: params[:identifier]
    if @login
      token = @login.set_reset_password_token
      UserMailer.with(user: @login, reset_token: token).reset_password.deliver_now if user.present?
    end
    head :no_content
  end

  def reset_password
    @login = Login.reset_password_by_token(reset_password_params)
  end

  private

  def reset_password_params
    params.require(:login).permit(:password, :password_confirmation, :reset_password_token)
  end
end
