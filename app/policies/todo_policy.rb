# frozen_string_literal: true

class TodoPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      VirtualEntity.todos(user.id)
    end
  end
end
