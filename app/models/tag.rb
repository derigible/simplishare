class Tag < ApplicationRecord
  belongs_to :user
  has_and_belongs_to_many :todos
  has_and_belongs_to_many :notes, join_table: 'tags_notes'

  TYPES = %w(todo).freeze
end
