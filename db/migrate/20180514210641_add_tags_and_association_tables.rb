class AddTagsAndAssociationTables < ActiveRecord::Migration[5.2]
  def change
    create_table :tags do |t|
      t.string :name,  null: false
      t.references :user, foreign_key: true
    end

    create_table :tags_todos do |t|
      t.belongs_to :tag, index: true, foreign_key: true
      t.belongs_to :todo, index: true, foreign_key: true
    end

    create_table :tags_events do |t|
      t.belongs_to :tag, index: true, foreign_key: true
      t.belongs_to :event, index: true, foreign_key: true
    end
  end
end
