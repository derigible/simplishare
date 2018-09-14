require_relative '../data_fixup/migrate_to_shared_tables_for_entities'

class MigrateToSharedTablesForEntities < ActiveRecord::Migration[5.2]
  def up
    DataFixup::MigrateToSharedTablesForEntities.run
  end

  def down
    # noop - we don't want to populate the tables the entities came from
  end
end
