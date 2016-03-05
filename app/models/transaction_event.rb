class TransactionEvent < ActiveRecord::Base
  has_many :accounts_transaction_events, dependent: :delete_all, autosave: true
  has_many :accounts, through: :accounts_transaction_events
end
