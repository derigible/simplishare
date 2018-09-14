class AddEntitiesTable < ActiveRecord::Migration[5.2]
  def change
    create_table :entities do |t|
      t.jsonb :data, default: {}
      t.string :type, null: false, index: true
      t.references :user, foreign_key: true
      t.timestamps null: false
    end

    create_table :entities_tags do |t|
      t.belongs_to :tag, index: true, foreign_key: true
      t.belongs_to :entity, index: true, foreign_key: true
    end
  end
end
