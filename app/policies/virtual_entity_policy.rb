class VirtualEntityPolicy < ApplicationPolicy
  def update?
    record_owner? && record.metadata.fetch(:permissions, []).include?('update')
  end

  def destroy?
    record_owner? && record.metadata.fetch(:permissions, []).include?('destroy')
  end
end
