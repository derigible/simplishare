# frozen_string_literal: true

class VirtualEntityPolicy < ApplicationPolicy
  def update?
    owner_or_has_permission? 'edit'
  end

  def archive?
    record_owner?
  end

  def archive_entity?
    owner_or_has_permission? 'edit'
  end

  def destroy?
    record_owner?
  end

  def destroy_entity?
    owner_or_has_permission?('destroy')
  end

  def share?
    owner_or_has_permission? 'share'
  end

  def shared_with?
    record_owner?
  end

  def shareable_with?
    record_owner?
  end

  private

  def owner_or_has_permission?(perm)
    record_owner? && (
      record.shared_on.nil? || # is the original owner of the resource
      record.metadata.fetch('permissions', []).include?(perm)
    )
  end
end
