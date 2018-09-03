# frozen_string_literal: true

class VirtualEntitiesTag < ApplicationRecord
  belongs_to :virtual_tag
  belongs_to :virtual_entity
end
