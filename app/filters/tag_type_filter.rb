class TagTypeFilter < BaseFilter
  # The `lookup_term` parameter should pass in query values as described below
  # Current lookup_terms available are:
  #
  #   todos - all tags attached to todos

  def todos_lookup
    scope.joins(:tags_todos).where.not(tags_todos: { todo_id: nil })
  end
end
