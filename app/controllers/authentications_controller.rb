# frozen_string_literal: true

class AuthenticationsController < AdministrationController
  def start() end

  def registrations() end

  def logout
    raise 'Action not supported'
  end

  def login
    if (user = Login.login(request.env['omniauth.auth']))
      reset_session
      session['current_user_id'] = user.id
      redirect_to '/'
    elsif params[:provider] == 'identity'
      flash[:error] = "Failed to login!"
      redirect_to '/auth/identity'
    end
  end

  def failure
    flash[:error] = "Login failure. Make sure you used the correct credentials when logging in."
    render :start
  end
end
