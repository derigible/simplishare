module V1
  class EventSerializer < ActiveModel::Serializer
    # TODO: add back in the date fields

    attributes :id, :description, :amount, :is_debit, :notes # , :created_at, :updated_at
  end
end
