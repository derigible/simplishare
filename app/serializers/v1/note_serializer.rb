module V1
  class AccountSerializer < ActiveModel::Serializer
    attributes :id, :title, :body, :created_at, :updated_at
    attribute :tags do
      object.tag_ids
    end
  end
end
