# frozen_string_literal: true

class VirtualTag < ApplicationRecord
  belongs_to :user
  belongs_to :tag
  has_many :virtual_entities_tags, dependent: :destroy
  has_many :virtual_entities, through: :virtual_entities_tags

  scope :tags, ->(user_id) do
    includes(:tag).where(virtual_tags: { user_id: user_id })
  end
end
