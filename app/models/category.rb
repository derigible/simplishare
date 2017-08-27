class Category < ApplicationRecord
  has_many :events_categories, dependent: :delete_all, autosave: true, inverse_of: :category
  has_many :events, through: :events_categories
end
