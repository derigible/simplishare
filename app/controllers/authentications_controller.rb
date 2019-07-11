# frozen_string_literal: true

class AuthenticationsController < AdministrationController
  def start() end

  def registrations() end

  def logout
    raise 'Action not supported'
  end

  def login
    l = Login.login(request.env['omniauth.auth'])
    if l&.waiting_confirmation?
      flash[:error] = "Awaiting confirmation of login!"
      redirect_to '/auth/identity'
    else
      reset_session
      session['current_user_id'] = l.user.id
      redirect_to '/'
    end
  end

  def failure
    flash[:error] = "Login failure. Make sure you used the correct credentials when logging in."
    render :start
  end
end
