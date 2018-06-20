class RemoveTodosAndNotesTables < ActiveRecord::Migration[5.2]
  def change
    drop_table :tags_todos do |t|
      t.integer :tag_id, index: true
      t.integer :todo_id, index: true
    end
    drop_table :tags_notes do |t|
      t.integer :tag_id, index: true
      t.integer :note_id, index: true
    end
    drop_table :todos do |t|
      t.references :user, index: true, foreign_key: true
      t.jsonb :todo, default: {}
      t.timestamps null: false
    end
    drop_table :notes do |t|
      t.string :title,  null: false
      t.string :body,  null: false
      t.references :user, foreign_key: true
      t.timestamps null: false
    end
  end
end
