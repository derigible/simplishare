require_relative '../data_fixup/give_default_username'

class ProvideUniqueUsernameToExistingUsers < ActiveRecord::Migration[5.2]
  def up
    DataFixup::GiveDefaultUsername.run
  end

  def down
    # noop - we don't want to populate the tables the entities came from
  end
end
