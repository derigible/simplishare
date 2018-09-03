# frozen_string_literal: true

class Contact < ApplicationRecord
  belongs_to :user
  belongs_to :contact, class_name: 'User', optional: true

  def reject!
    update! rejected_on: Time.zone.now
  end
end
