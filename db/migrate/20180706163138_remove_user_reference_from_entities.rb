class RemoveUserReferenceFromEntities < ActiveRecord::Migration[5.2]
  def change
    remove_reference :entities, :user
  end
end
