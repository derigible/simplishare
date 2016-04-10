class Account < ActiveRecord::Base
  has_many :events_accounts, dependent: :delete_all, autosave: true, inverse_of: :account
  has_many :events, through: :events_accounts, source: :event
end
