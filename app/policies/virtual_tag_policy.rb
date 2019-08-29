# frozen_string_literal: true

class VirtualTagPolicy < ApplicationPolicy
  def tag?
    record_owner?
  end

  def untag?
    record_owner?
  end
end
