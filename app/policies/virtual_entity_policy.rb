# frozen_string_literal: true

class VirtualEntityPolicy < ApplicationPolicy
  def show?
    record_owner? && entity_owner_or_has_permission?('read')
  end

  def update?
    record_owner? && entity_owner_or_has_permission?('edit')
  end

  def archive?
    record_owner?
  end

  def archive_entity?
    record_owner? && entity_owner_or_has_permission?('archive')
  end

  def destroy?
    record_owner?
  end

  def destroy_entity?
    record_owner? && entity_owner_or_has_permission?('destroy')
  end

  def share?
    record_owner? && entity_owner_or_has_permission?('share')
  end

  def shared_with?
    record_owner?
  end

  def shareable_with?
    record_owner?
  end

  def preferences?
    record_owner?
  end

  def snooze?
    record_owner?
  end

  class Scope
    attr_reader :user, :scope

    def resolve
      scope.where("virtual_entities.metadata -> 'permissions' ?| array[:permissions]", permissions: %w[owner read])
    end
  end

  private

  def entity_owner_or_has_permission?(perm)
    perms = record.metadata.fetch('permissions', [])
    perms.include?('owner') || perms.include?(perm)
  end
end
