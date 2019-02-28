# frozen_string_literal: true

class Note < Entity
  before_validation :ensure_priority
  validate :body_exists

  private

  def ensure_priority
    self.priority = 'medium' if priority.nil?
  end

  def body_exists
    errors.add(:base, 'Body cannot be blank.') unless data['body']
  end
end
