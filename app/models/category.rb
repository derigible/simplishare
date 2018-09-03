# frozen_string_literal: true

class Category < ApplicationRecord
  has_and_belongs_to_many :categories, join_table: :events_categories

  belongs_to :user
end
