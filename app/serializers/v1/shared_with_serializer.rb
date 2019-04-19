# frozen_string_literal: true

module V1
  class SharedWithSerializer < ActiveModel::Serializer
    attribute :id do
      object.user_id.to_s
    end
    attribute :email do
      object.user.email
    end
    attribute :permissions do
      object.metadata.fetch('permissions', [])
    end
  end
end
