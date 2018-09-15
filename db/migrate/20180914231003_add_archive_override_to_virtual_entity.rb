class AddArchiveOverrideToVirtualEntity < ActiveRecord::Migration[5.2]
  def change
    add_column :virtual_entities, :archived, :boolean
  end
end
