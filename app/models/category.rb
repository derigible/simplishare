class Category < ActiveRecord::Base
  has_many :events_categories, dependent: :delete_all, autosave: true
  has_many :events, through: :events_categories
end
