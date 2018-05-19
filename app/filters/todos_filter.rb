class TodosFilter < BaseFilter
  # The `lookup_term` parameter should pass in query values as described below
  # Current lookup_terms available are:
  #
  #   tags - all todos attached to a tag, lookup_param = id of a tag
  #   *NOTE: if the lookup_param parameter does not specify a value, then will
  #          return all todos with a tag attached

  def tags_lookup
    if params[:lookup_param]
      scope.joins(:tags_todos).where(tags_todos: { tag_id: params[:lookup_param] })
    else
      scope.joins(:tags_todos).where.not(tags_todos: { tag_id: nil })
    end
  end
end
