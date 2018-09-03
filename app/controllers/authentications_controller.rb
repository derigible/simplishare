class AuthenticationsController < AdministrationController
  respond_to :json

  def logout
    raise 'Action not supported'
  end

  def login
    user = User.authenticate(login_params[:email], login_params[:password])
    render(json: { token: token(user) }, status: :ok) && return if user.present?
    render json: { error: 'Password and username combo did not match' }, status: :unauthorized
  end

  private

  def token(user)
    claim = {
      iss: 'pinkairship',
      sub: user.id,
      exp: 1.week.from_now,
      nbf: Time.zone.now
    }
    jws = JSON::JWT.new(claim).sign(Delegates::AuthenticationMethods.private_key, :RS256)
    jws.to_s
  end

  def login_params
    params.require(:user).permit(:email, :password)
  end
end
