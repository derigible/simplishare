# frozen_string_literal: true

class UsersController < ApplicationController
  respond_to :json, :html

  def authorize_contact
    contact = Contact.find_by! authorization_code: params[:authorization_code]
    return if contact.authorized_on.present?

    if params[:reject].present?
      contact.reject!
      render('invitation_rejected') and return
    end

    @url = "#{UserMailer::PINKAIRSHIP_ADDRESS}/#!auth?registering=true&invitation_code=#{params[:authorization_code]}"
    render('please_register') && return if contact.contact_id.blank?

    contact.update!(authorized_on: Time.zone.now)
    @user = contact.user
  end

  def unlock
    u = Users.find_by(unlock_token: params[:unlock_token])
    u&.unlock!
  end

  def info
    user = User.find_by(id: session['current_user_id'])
    if user.present?
      respond_with user, serializer: UserSerializer
    else
      render json: { error: 'User not authenticated' }, status: :unauthorized
    end
  end
end
