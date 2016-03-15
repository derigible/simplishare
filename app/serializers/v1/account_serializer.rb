module V1
  class AccountSerializer < ActiveModel::Serializer
    attributes :id, :name

    has_many :events
  end
end
