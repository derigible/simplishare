class AddDisplayName < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :display_name, :string, null: true
  end
end
