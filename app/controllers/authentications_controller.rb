# frozen_string_literal: true

class AuthenticationsController < AdministrationController
  respond_to :json

  def logout
    raise 'Action not supported'
  end

  def login
    if (user = Login.login(request.env['omniauth.auth']))
      reset_session
      session['current_user_id'] = user.id
      debugger
      redirect_to '/'
    elsif params[:provider] == 'identity'
      flash[:error] = "Failed to login!"
      redirect_to '/auth/identity'
    end
  end

  private

  def login_json(user)
    {
      token: token(user),
      id: user.id,
      email: user.email,
      username: user.username,
      preferences: user.preferences
    }
  end

  def token(user)
    claims = {
      iss: 'pinkairship',
      sub: user.id,
      exp: 1.week.from_now,
      iat: Time.zone.now
    }
    jws = JSON::JWT.new(claims).sign(Delegates::AuthenticationMethods.private_key, :RS256)
    jws.to_s
  end
end
