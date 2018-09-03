# frozen_string_literal: true

class Account < ApplicationRecord
  has_and_belongs_to_many :events, join_table: :events_accounts

  belongs_to :user
end
