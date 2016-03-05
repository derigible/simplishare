class AccountsTransactionEvent < ActiveRecord::Base
  belongs_to :account
  belongs_to :transaction_event
end
