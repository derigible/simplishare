# frozen_string_literal: true

class UserMailer < ApplicationMailer
  default from: 'noreply@pinkairship.com'
  PINKAIRSHIP = Rails.configuration.x.pinkairship
  UNLOCK_TIME = Rails.configuration.x.pinkairship.unlock_after_time

  def welcome_email
    @user = params[:user]
    @url  = params[:url]
    mail(to: @user.email, subject: 'Welcome to PinkAirship.com!')
  end

  def reset_password
    @user = params[:user]
    @url = params[:reset_url]
    mail(to: @user.email, subject: 'Reset Password to PinkAirship.com!')
  end

  def contact_invitation
    @user = params[:user]
    @url = params[:url]
    mail(to: params[:invitation_email], subject: 'You have been invited to make a connection')
  end

  def join_invitation
    @invitee_email = params[:invitee_email]
    @url = params[:register_url]
    mail(to: params[:invitation_email], subject: 'You have been invited to join PinkAirship.com!')
  end

  def unlock
    @user = params[:user]
    @url = params[:url]
    @unlock_time = UNLOCK_TIME / 1.hour
    mail(to: @user.email, subject: 'Your account has been locked')
  end
end
