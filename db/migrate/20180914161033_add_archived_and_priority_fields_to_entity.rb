class AddArchivedAndPriorityFieldsToEntity < ActiveRecord::Migration[5.2]
  def change
    add_column :entities, :archived, :boolean
    add_column :entities, :priority, :string
  end
end
