module V1
  class UsersController < ApiController
    def create
      @user = User.new(user_params)
      authorize User
      if @user.save
        UserMailer.with(user: @user).welcome_email.deliver_now
      end
      respond_with @user, status: :created, serializer: UserSerializer
    end

    private

    def user_params
      params.require(:user).permit(:email, :password, :password_confirmation)
    end
  end
end
