# frozen_string_literal: true

class Event < ApplicationRecord
  has_and_belongs_to_many :accounts, join_table: :events_accounts
  has_and_belongs_to_many :categories, join_table: :events_categories

  belongs_to :user
end
