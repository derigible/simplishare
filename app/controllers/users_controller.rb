class UsersController < AdministrationController
  def create
    @user = User.new(user_params)
    UserMailer.with(user: @user, url: url).welcome_email.deliver_now if @user.save
    respond_with @user, status: :created, serializer: UserSerializer
  end

  def resend_confirmation
    # check user creds
    # do confirm email stuff here if valid
  end

  def confirm_email
    @user = User.confirm_by_token(params[:confirmation_token])
    raise ActiveRecord::RecordInvalid, @user unless @user.valid?
  end

  def forgot_password
    user = User.find_by email: user_params[:email]
    # devise has this listed as protected since they expect this to be done through
    # normal rails conventions. Dumb.
    token = user.send(:set_reset_password_token)
    UserMailer.with(user: user, reset_token: token).reset_password.deliver_now if user.present?
    head :no_content
  end

  def reset_password
    user = User.reset_password_by_token(reset_password_params)
    debugger
    raise ActionController::BadRequest, 'Email provided does not match token reset email.' if user_params[:email] != user.email
    respond_with user, status: :ok, serializer: UserSerializer
  end

  private

  def url
    "#{confirm_email_user_url(@user.id)}?confirmation_token=#{@user.confirmation_token}"
  end

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation)
  end

  def reset_password_params
    params.require(:user).permit(:password, :password_confirmation, :reset_password_token)
  end
end
