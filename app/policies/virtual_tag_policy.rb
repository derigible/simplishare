# frozen_string_literal: true

class VirtualTagPolicy < ApplicationPolicy
  def update?
    super && record.metadata.fetch(:permissions, []).include?('edit')
  end

  def tag?
    record_owner?
  end

  def untag?
    record_owner?
  end
end
