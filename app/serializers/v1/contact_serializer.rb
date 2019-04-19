# frozen_string_literal: true

module V1
  class ContactSerializer < ActiveModel::Serializer
    attribute :id do
      object.id.to_s
    end
    attribute :created_at
    attribute :contact_id do
      object.contact_id&.zero? ? 'pending' : object.contact_id.to_s
    end
    attribute :email do
      object.invitation_sent_to
    end
  end
end
