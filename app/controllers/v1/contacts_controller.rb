# frozen_string_literal: true

module V1
  class ContactsController < ApiController
    before_action :load_contact, except: %i[index create]

    def index
      skip_policy_scope
      respond_with current_user.contacts_for_serialization, each_serializer: ContactSerializer
    end

    def create
      invitation_user = User.find_by email: contact_params[:email]

      if invitation_user == current_user
        invitation_user.errors.add(:base, 'Cannot connect with self')
        raise ActiveRecord::RecordInvalid, invitation_user
      end
      contact = if invitation_user.present?
                  current_user.contacts.find_by contact: invitation_user
                else
                  current_user.contacts.find_by invitation_sent_to: params[:email]
                end
      if contact.present?
        contact.errors.add(:base, 'Contact Invitation already created')
        raise ActiveRecord::RecordInvalid, contact
      end
      contact = Contact.new(
        user: current_user,
        invitation_sent_to: contact_params[:email],
        authorization_code: SecureRandom.uuid,
        contact: invitation_user
      )
      authorize contact
      contact.save!
      contact.reload
      if invitation_user.present?
        UserMailer.with(
          user: contact.user,
          url: invitiation_confirm_url(contact),
          invitation_email: contact_params[:email]
        ).contact_invitation.deliver_now
      else
        UserMailer.with(
          invitation_email: contact_params[:email],
          invitee_email: contact.user.email,
          invitation_code: contact.authorization_code
        ).join_invitation.deliver_now
      end
      c = Contact.new(
        contact_id: 'pending', created_at: contact.created_at, invitation_sent_to: contact_params[:email], id: contact.id
      )
      respond_with c, status: :created, serializer: ContactSerializer
    end

    def show
      respond_with @contact, serializer: ContactSerializer
    end

    def destroy
      @contact.destroy
      head :no_content
    end

    private

    def load_contact
      @contact = Contact.find(params[:id])
    end

    def contact_params
      params.require(:contact).permit(:email)
    end

    def invitiation_confirm_url(contact)
      "#{authorize_contact_users_url}?authorization_code=#{contact.authorization_code}"
    end
  end
end
