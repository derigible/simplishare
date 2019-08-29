class AddOwnerFlagToVirtualEntity < ActiveRecord::Migration[5.2]
  def change
    add_column :virtual_entities, :entity_owner, :boolean, default: false
  end
end
