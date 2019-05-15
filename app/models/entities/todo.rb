# frozen_string_literal: true

class Todo < Entity
  validate :title_exists
  # TODO: add more validations

  alias_attribute :todo, :data

  private

  def title_exists
    errors.add(:base, 'Title cannot be blank.') unless data['title']
  end
end
