class EventPolicy < ApplicationPolicy
  def bulk_create?
    create?
  end
end
