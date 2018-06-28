module V1
  class UsersController < ApiController
    def create
      @user = User.new(user_params)
      authorize User
      UserMailer.with(user: @user, url: url).welcome_email.deliver_now if @user.save
      respond_with @user, status: :created, serializer: UserSerializer
    end

    def resend_confirmation
      # check user creds
      # do confirm email stuff here if valid
    end

    def confirm_email
      skip_authorization
      @user = User.confirm_by_token(params[:confirmation_token])
      return if @user.valid?
      raise ActiveRecord::RecordInvalid, @user
    end

    private

    def url
      "#{confirm_email_user_url(@user.id)}?confirmation_token=#{@user.confirmation_token}"
    end

    def user_params
      params.require(:user).permit(:email, :password, :password_confirmation)
    end
  end
end
