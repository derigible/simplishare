# frozen_string_literal: true

class AuthenticationsController < AdministrationController
  def start() end

  def registration() end

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
      redirect_to '/'
    end
  end

  def failure
    flash[:error] = "Login failure. Make sure you used the correct credentials when logging in."
    render :start
  end

  def failed_registration
    flash[:error] = "Registration failure. Likely your password and password confirmation did not match."
    render :registration
  end
end
