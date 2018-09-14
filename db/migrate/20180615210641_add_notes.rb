class AddNotes < ActiveRecord::Migration[5.2]
  def change
    create_table :notes do |t|
      t.string :title,  null: false
      t.string :body,  null: false
      t.references :user, foreign_key: true
      t.timestamps null: false
    end

    create_table :tags_notes do |t|
      t.belongs_to :tag, index: true, foreign_key: true
      t.belongs_to :note, index: true, foreign_key: true
    end

    remove_reference :todos, :event, index: true, foreign_key: true
  end
end
