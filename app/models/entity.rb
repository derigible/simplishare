class Entity < ApplicationRecord
  belongs_to :user
  has_and_belongs_to_many :tags

  validate :validate_type_unchanged, on: [:update]

  # TODO: add validations

  private

  def validate_type_unchanged
    errors.add(:base, 'cannot change type') if type_changed?
  end
end
