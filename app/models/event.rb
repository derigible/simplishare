class Event < ActiveRecord::Base
  has_many :accounts_events, dependent: :delete_all, autosave: true
  has_many :accounts, through: :accounts_events
end
