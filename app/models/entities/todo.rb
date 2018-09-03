# frozen_string_literal: true

class Todo < Entity
  PRIORITY_TYPES = %w[low medium high].freeze
  before_save :ensure_proper_todo_formats

  validates :data, presence: true
  validate :title_exists
  validate :priority_exists_and_correct
  # TODO: add more validations

  alias_attribute :todo, :data

  private

  def title_exists
    errors.add(:base, 'Title cannot be blank.') unless data['title']
  end

  def priority_exists_and_correct
    if data['priority'].blank?
      errors.add(:base, 'Priority cannot be blank.')
    elsif !PRIORITY_TYPES.include? data['priority']
      errors.add(:base, "Priority must be one of #{PRIORITY_TYPES.join(',')}")
    end
  end

  def ensure_proper_todo_formats
    self.data = data.merge('todos' => []) if data['todos'].nil?
    ensure_todos(data['todos'])
  end

  def ensure_todos(todos)
    todos.each do |t|
      t['todos'] = [] if t['todos'].nil?
      ensure_todos(t['todos'])
    end
  end
end
