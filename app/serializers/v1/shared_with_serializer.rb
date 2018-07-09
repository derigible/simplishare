module V1
  class SharedWithSerializer < ActiveModel::Serializer
    attribute :id do
      object.user_id
    end
    attribute :email do
      object.user_email
    end
    attribute :permissions do
      object.metadata.fetch('permissions', [])
    end
  end
end
