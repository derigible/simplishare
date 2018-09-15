# frozen_string_literal: true

class Todo < Entity
  before_save :ensure_proper_todo_formats
  validate :title_exists
  # TODO: add more validations

  alias_attribute :todo, :data

  private

  def title_exists
    errors.add(:base, 'Title cannot be blank.') unless data['title']
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
