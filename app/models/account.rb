class Account < ActiveRecord::Base
  has_many :accounts_transaction_events, dependent: :delete_all, autosave: true
  has_many :transaction_events, through: :accounts_transaction_events, source: :transaction_event
end
