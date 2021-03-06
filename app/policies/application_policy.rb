# frozen_string_literal: true

class ApplicationPolicy
  attr_reader :user, :record

  def initialize(user, record)
    @user = user
    @record = record
  end

  def show?
    record_owner?
  end

  def create?
    true
  end

  def update?
    record_owner?
  end

  def destroy?
    record_owner?
  end

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      scope.where(user: user)
    end
  end

  protected

  def record_owner?
    record.user_id == user.id
  end
end
