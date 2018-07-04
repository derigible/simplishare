class Tag < ApplicationRecord
  has_many :virtual_tags, dependent: :delete_all
  has_many :users, through: :virtual_tags
end
