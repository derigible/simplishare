module V1
  class UsersController < ApiController
    def create
      @user = User.new(user_params)
      authorize User
      UserMailer.with(user: @user).welcome_email.deliver_now if @user.save
      respond_with @user, status: :created, serializer: UserSerializer
    end

    def resend_confirmation
      # check user creds
      # do confirm email stuff here if valid
    end

    private

    def user_params
      params.require(:user).permit(:email, :password, :password_confirmation)
    end
  end
end
