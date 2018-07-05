class VirtualEntityPolicy < ApplicationPolicy
  def update?
    record_owner? && record.metadata.fetch(:permissions, []).include?('update')
  end

  def destroy?
    record_owner? && record.metadata.fetch(:permissions, []).include?('destroy')
  end

  def share?
    record_owner? && (
      record.shared_on.nil? || # is the original owner of the resource
      record.metadata.fetch(:permissions, []).include?('share')
    )
  end
end