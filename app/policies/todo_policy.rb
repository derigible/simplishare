# frozen_string_literal: true

class TodoPolicy < VirtualEntityPolicy
  class Scope < Scope
    def initialize(user, _)
      @user = user
      @scope = VirtualEntity.todos(user.id)
    end
  end
end
