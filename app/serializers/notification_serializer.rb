# frozen_string_literal: true

class NotificationSerializer < ActiveModel::Serializer
  attribute :id do
    object.id.to_s
  end
  attribute :user_id do
    object.user_id.to_s
  end
  attribute :created_at
  attribute :updated_at
  attribute :read
  attribute :data
end
