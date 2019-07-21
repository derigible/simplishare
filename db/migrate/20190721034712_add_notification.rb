class AddNotification < ActiveRecord::Migration[5.2]
  def change
    create_table :notifications do |t|
      t.jsonb :data, default: {}
      t.boolean :read, default: false
      t.references :user, index: true, foreign_key: true
      t.timestamps null: false
    end
  end
end
