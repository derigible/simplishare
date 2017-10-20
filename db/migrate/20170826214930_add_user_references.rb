class AddUserReferences < ActiveRecord::Migration[5.1]
  def change
    add_reference :events, :user, foreign_key: true
    add_reference :categories, :user, foreign_key: true
    add_reference :accounts, :user, foreign_key: true
  end
end
