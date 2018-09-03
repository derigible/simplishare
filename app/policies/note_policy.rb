# frozen_string_literal: true

class NotePolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      VirtualEntity.notes(user.id)
    end
  end
end
