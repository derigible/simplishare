class AddTodoModels < ActiveRecord::Migration[5.1]
  def change
    create_table :todos do |t|
      t.references :user, index: true, foreign_key: true
      t.jsonb :todo, default: {}
      t.references :event, index: true, foreign_key: true
      t.timestamps null: false
    end
  end
end
