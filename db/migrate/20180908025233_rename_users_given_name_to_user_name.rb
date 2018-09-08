class RenameUsersGivenNameToUserName < ActiveRecord::Migration[5.2]
  def change
    rename_column :users, :given_name, :username
  end
end
