class TodoPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      VirtualEntity.todos(user.id)
    end
  end
end
