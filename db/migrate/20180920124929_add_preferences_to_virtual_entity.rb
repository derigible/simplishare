class AddPreferencesToVirtualEntity < ActiveRecord::Migration[5.2]
  def change
    add_column :virtual_entities, :preferences, :jsonb, default: {}
  end
end
