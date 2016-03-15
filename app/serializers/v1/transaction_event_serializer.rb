module V1
  class TransactionEventSerializer < ActiveModel::Serializer

    # TODO: add back in the date fields

    attributes :id, :account_id, :description, :amount, :is_debit, :notes # , :created_at, :updated_at
  end
end
