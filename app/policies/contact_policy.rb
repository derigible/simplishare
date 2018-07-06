class ContactPolicy < ApplicationPolicy
  protected

  def record_owner?
    record.user_id == user.id || record.contact_id == user.id
  end
end
