require_relative '../data_fixup/add_shared_to_virtual_entities'

class AddSharedToVirtualEntities < ActiveRecord::Migration[5.2]
  def up
    DataFixup::AddSharedToVirtualEntities.run
  end

  def down
    # noop - we don't want to run this on down
  end
end
