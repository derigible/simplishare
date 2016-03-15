class Category < ActiveRecord::Base
  has_many :categories_events, dependent: :delete_all, autosave: true
  has_many :events, through: :categories_events
end
