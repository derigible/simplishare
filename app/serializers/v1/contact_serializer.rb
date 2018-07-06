module V1
  class EventSerializer < ActiveModel::Serializer
    attributes :id, :contact_id, :created_at
  end
end
