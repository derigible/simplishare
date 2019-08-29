# frozen_string_literal: true

class AuthenticationsController < ApplicationController
  def start
    redirect_to '/' if User.find_by(id: session['current_user_id']) && !params[:reauth]
  end

  def registration
    @authorization_code = params[:authorization_code]
  end

  def logout
    raise 'Action not supported'
  end

  def login
    login = Login.login(request.env['omniauth.auth'])
    if login&.waiting_confirmation?
      flash[:error] = "Awaiting confirmation of login!"
      render :start
    else
      reset_session
      session['current_user_id'] = login.user.id
      redirect_to '/#!home'
    end
  end

  def failure
    redirect_to '/' and return if User.find_by(id: session['current_user_id']) && !params[:reauth]
    flash[:error] = "Login failure. Make sure you used the correct credentials when logging in."
    render :start
  end

  def failed_registration
    flash[:error] = "Registration failure. Likely your password and password confirmation did not match."
    render :registration
  end
end
