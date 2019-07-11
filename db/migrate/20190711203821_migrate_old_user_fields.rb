require_relative '../data_fixup/migrate_user_logins_to_login'

class MigrateOldUserFields < ActiveRecord::Migration[5.2]
  def up
    DataFixup::MigrateUserLoginsToLogin.run
  end

  def down
    # noop - we don't want to populate the tables the entities came from
  end
end
