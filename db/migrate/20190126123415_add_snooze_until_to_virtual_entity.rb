class AddSnoozeUntilToVirtualEntity < ActiveRecord::Migration[5.2]
  def change
    add_column :virtual_entities, :snooze_until, :datetime
    add_index :virtual_entities, :snooze_until
  end
end
