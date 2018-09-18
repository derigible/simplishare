# frozen_string_literal: true

class NotePolicy < VirtualEntityPolicy
  class Scope < Scope
    def initialize(user, _)
      @user = user
      @scope = VirtualEntity.notes(user.id)
    end
  end
end
