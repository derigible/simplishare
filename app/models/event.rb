class Event < ActiveRecord::Base
  has_many :events_accounts, dependent: :delete_all, autosave: true, inverse_of: :event
  has_many :accounts, through: :events_accounts

  has_many :events_categories, dependent: :delete_all, autosave: :true, inverse_of: :event
  has_many :categories, through: :events_categories
end
