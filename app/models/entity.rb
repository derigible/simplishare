class Entity < ApplicationRecord
  has_many :virtual_entities, dependent: :delete_all
  has_many :users, through: :virtual_entities

  validate :validate_type_unchanged, on: [:update]
  validate :data_is_hash

  def shared_with_except_user(except_user)
    virtual_entities.where.not(user: except_user).joins(:user).select('users.email as user_email', :metadata, :shared_on, :user_id)
  end

  # TODO: add validations

  private

  def validate_type_unchanged
    errors.add(:base, 'cannot change type') if type_changed?
  end

  def data_is_hash
    errors.add(:data, 'Data must be a hash') unless data.is_a? Hash
  end
end
require_dependency 'entities/todo'
require_dependency 'entities/note'
