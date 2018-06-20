require_relative '../data_fixup/migrate_to_entities'

class MigrateToEntities < ActiveRecord::Migration[5.2]
  def up
    DataFixup::MigrateToEntities.run
  end

  def down
    # noop - we don't want to populate the entities table again
  end
end
