# frozen_string_literal: true

class LoginsController < ApplicationController
  def begin_resend_confirmation() end

  def resend_confirmation
    login = PasswordLogin.find_by identifier: params[:identifier]
    login.send_login_confirmation if login&.authenticate(params[:password], skip_track: true)
  end

  def confirm_email
    @login = Login.confirm(params[:confirmation_token])
  end

  def forgot_password
    @login = Login.find_by identifier: params[:identifier]
    UserMailer.with(user: @login, reset_url: reset_url).reset_password.deliver_now if @login.present?
  end

  def begin_forgot_password() end

  def reset_password
    @login = Login.reset_password(reset_password_params)
  end

  def begin_reset_password
    @reset_password_token = params[:reset_password_token]
  end

  private

  def reset_url
    "#{reset_password_logins_url}?reset_password_token=#{@login.set_reset_password_token}"
  end

  def reset_password_params
    params.require(:login).permit(:password, :password_confirmation, :reset_password_token)
  end
end
