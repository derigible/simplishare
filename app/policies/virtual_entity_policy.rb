# frozen_string_literal: true

class VirtualEntityPolicy < ApplicationPolicy
  def show?
    owner_or_has_permission? 'read'
  end

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

  def preferences?
    record_owner?
  end

  class Scope
    attr_reader :user, :scope

    def resolve
      scope.where("virtual_entities.metadata -> 'permissions' ?| array[:permissions]", permissions: %w[owner read])
    end
  end

  private

  def owner_or_has_permission?(perm)
    record_owner? && (
      record.metadata.fetch('permissions', []).include?('owner') ||
      record.metadata.fetch('permissions', []).include?(perm)
    )
  end
end
