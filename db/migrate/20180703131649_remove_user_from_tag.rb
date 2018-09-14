class RemoveUserFromTag < ActiveRecord::Migration[5.2]
  def change
    remove_reference :tags, :user
  end
end
