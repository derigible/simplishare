class Event < ActiveRecord::Base
  has_many :accounts_events, dependent: :delete_all, autosave: true
  has_many :accounts, through: :accounts_events

  has_many :events_categories, dependent: :delete_all, autosave: :true
  has_many :categories, through: :events_categories
end
