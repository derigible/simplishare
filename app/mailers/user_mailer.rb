# frozen_string_literal: true

class UserMailer < ApplicationMailer
  default from: 'noreply@pinkairship.com'
  PINKAIRSHIP = Rails.configuration.x.pinkairship
  PINKAIRSHIP_ADDRESS = "#{PINKAIRSHIP[:protocol]}://#{PINKAIRSHIP[:host]}"

  def welcome_email
    @user = params[:user]
    @url  = params[:url]
    mail(to: @user.email, subject: 'Welcome to PinkAirship.com!')
  end

  def reset_password
    @user = params[:user]
    @url = "#{PINKAIRSHIP_ADDRESS}/#!auth/resetPassword?reset_token=#{params[:reset_token]}"
    mail(to: @user.email, subject: 'Reset Password to PinkAirship.com!')
  end

  def contact_invitation
    @user = params[:user]
    @url = params[:url]
    mail(to: params[:invitation_email], subject: 'You have been invited to make a connection')
  end

  def join_invitation
    @invitee_email = params[:invitee_email]
    @url = "#{PINKAIRSHIP_ADDRESS}/#!auth?registering=true&invitation_code=#{params[:invitation_code]}"
    mail(to: params[:invitation_email], subject: 'You have been invited to join PinkAirship.com!')
  end
end
