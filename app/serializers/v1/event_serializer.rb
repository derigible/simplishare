module V1
  class EventSerializer < ActiveModel::Serializer
    # TODO: add back in the date fields

    attributes :id, :date, :description, :amount, :is_debit, :notes
  end
end
