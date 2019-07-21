# frozen_string_literal: true

class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :preferences, :preferred_name
  attribute :display_name do
    object.display_name || object.preferred_name
  end
end
