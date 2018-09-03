# frozen_string_literal: true

class EventPolicy < ApplicationPolicy
  def bulk_create?
    create?
  end
end
