# frozen_string_literal: true

class UsersController < AdministrationController
  def create
    @user = User.new(user_params.except(:invitation_code))
    UserMailer.with(user: @user, url: url).welcome_email.deliver_now if @user.save
    if user_params[:invitation_code].present?
      contact = Contact.find_by authorization_code: user_params[:invitation_code]
      contact.update!(contact: @user)
    end
    respond_with @user, status: :created, serializer: UserSerializer
  end

  def resend_confirmation
    # check user creds
    # do confirm email stuff here if valid
  end

  def confirm_email
    @user = User.confirm_by_token(params[:confirmation_token])
    raise ActiveRecord::RecordInvalid, @user unless @user.valid?
    @user.contacts.update_all(authorized_on: Time.zone.now)
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
    raise ActionController::BadRequest, 'Email provided does not match token reset email.' if user_params[:email] != user.email
    respond_with user, status: :ok, serializer: UserSerializer
  end

  def authorize_contact
    contact = Contact.find_by! authorization_code: params[:authorization_code]
    return if contact.authorized_on.present?

    if params[:reject].present?
      contact.reject!
      render('invitation_rejected') and return
    end

    @url = "#{UserMailer::PINKAIRSHIP_ADDRESS}/#!auth?registering=true&invitation_code=#{params[:authorization_code]}"
    render('please_register') && return if contact.contact_id.blank?

    contact.update!(authorized_on: Time.zone.now)
    @user = contact.user
  end

  def show
    user = User.find params[:id]
    respond_with user, serializer: UserSerializer
  end

  private

  def url
    "#{confirm_email_users_url}?confirmation_token=#{@user.confirmation_token}"
  end

  def user_params
    params.require(:user).permit(:username, :email, :password, :password_confirmation, :invitation_code)
  end

  def reset_password_params
    params.require(:user).permit(:password, :password_confirmation, :reset_password_token)
  end
end
