# frozen_string_literal: true

class Event < ApplicationRecord
  has_and_belongs_to_many :accounts, join_table: :events_accounts, dependent: :delete_all
  has_and_belongs_to_many :categories, join_table: :events_categories, dependent: :delete_all

  belongs_to :user
end
