class Todo < ApplicationRecord
  belongs_to :event, optional: true
  belongs_to :user

  before_save :ensure_proper_todo_formats

  # TODO: add validations

  private

  def ensure_proper_todo_formats
    self.todo['todos'] = [] if self.todo['todos'].nil?
    ensure_todos(self.todo['todos'])
  end

  def ensure_todos(todos)
    todos.each do |todo|
      todo['todos'] = [] if todo['todos'].nil?
      ensure_todos(todo['todos'])
    end
  end
end
