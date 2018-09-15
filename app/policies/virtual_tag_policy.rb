# frozen_string_literal: true

class VirtualTagPolicy < ApplicationPolicy
  def update?
    record_owner? && record.metadata.fetch(:permissions, []).include?('edit')
  end

  def destroy?
    record_owner?
  end
end
