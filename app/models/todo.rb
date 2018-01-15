class EventsCategory < ApplicationRecord
  belongs_to :event
  belongs_to :user

  # TODO: add validations
end
