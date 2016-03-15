class Account < ActiveRecord::Base
  has_many :accounts_events, dependent: :delete_all, autosave: true
  has_many :events, through: :accounts_events, source: :event
end
