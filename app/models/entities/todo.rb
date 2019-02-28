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

  def sub_todo_titles_exist(todos = todo['todos'])
    todos.each do |t|
      errors.add(:base, 'Title of sub todo cannot be blank.') if t['title'].blank?
      sub_todo_titles_exist(t['todos'])
    end
  end

  def ensure_proper_todo_formats
    self.data = data.merge('todos' => []) if data['todos'].nil?
    ensure_todos(data['todos'])
  end

  def ensure_todos(todos)
    todos.each do |t|
      ensure_sub_todo(t)
      ensure_todos(t['todos'])
    end
  end

  def ensure_sub_todo(todo)
    todo['todos'] = [] if todo['todos'].nil?
    todo['id'] = SecureRandom.uuid if todo['id'].nil?
    todo['created_at'] = Time.zone.now if todo['created_at'].nil?
    todo['updated_at'] = Time.zone.now if todo['updated_at'].nil?
  end
end
