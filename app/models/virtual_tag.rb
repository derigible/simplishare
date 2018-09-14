# frozen_string_literal: true

class VirtualTag < ApplicationRecord
  belongs_to :user
  belongs_to :tag

  scope :tags, ->(user_id) do
    includes(:tag).where(virtual_tags: { user_id: user_id })
  end
end
