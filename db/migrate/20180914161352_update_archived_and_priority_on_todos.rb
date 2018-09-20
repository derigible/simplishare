require_relative '../data_fixup/update_archived_and_priority_on_todos'

class UpdateArchivedAndPriorityOnTodos < ActiveRecord::Migration[5.2]
  def up
    DataFixup::UpdateArchivedAndPriorityOnTodos.run
  end

  def down
    # noop - we don't want to run this on down
  end
end
