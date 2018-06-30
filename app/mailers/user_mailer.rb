class UserMailer < ApplicationMailer
  default from: 'notifications@example.com'

  def welcome_email
    @user = params[:user]
    @url  = params[:url]
    mail(to: @user.email, subject: 'Welcome to My Awesome Site')
  end

  def reset_password
    @user = params[:user]
    mail(to: @user.email, subject: 'Reset Password to My Awesome Site')
  end
end
