# frozen_string_literal: true

class NotificationPolicy < ApplicationPolicy
  protected

  def record_owner?
    record.user_id == user.id
  end
end
