module V1
  class ContactSerializer < ActiveModel::Serializer
    attributes :id, :contact_id, :email, :created_at
  end
end
