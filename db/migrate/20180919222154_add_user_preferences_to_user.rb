class AddUserPreferencesToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :preferences, :jsonb, default: {}
  end
end
