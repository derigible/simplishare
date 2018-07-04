class TagPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      VirtualTag.tags(user.id)
    end
  end
end
