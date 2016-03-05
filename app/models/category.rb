class Category < ActiveRecord::Base
  has_many :categories_transaction_events, dependent: :delete_all, autosave: true
  has_many :transaction_events, through: :categories_transaction_events
end
