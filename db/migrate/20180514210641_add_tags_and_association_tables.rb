class AddTagsAndAssociationTables < ActiveRecord::Migration[5.2]
  def change
    create_table :tags do |t|
      t.string :name,  null: false
      t.references :user, foreign_key: true
    end

    create_table :tags_todos do |t|
      t.references :tags, index: true, foreign_key: true
      t.references :todos, index: true, foreign_key: true
    end

    create_table :tags_events do |t|
      t.references :tags, index: true, foreign_key: true
      t.references :todos, index: true, foreign_key: true
    end
  end
end
