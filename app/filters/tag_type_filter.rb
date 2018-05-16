class TagTypeFilter < BaseFilter
  # The `lookup_term` parameter should pass in query values as described below
  # Current lookup_terms available are:
  #
  #   todos - all todos attached to tag

  def todos_lookup
    scope.todos
  end
end
