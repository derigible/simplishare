class CreateV1Accounts < ActiveRecord::Migration
  def change
    create_table :accounts do |t|
      t.string :name, null: false, unique: true
    end

    create_table :events do |t|
      t.references :account, index: true, foreign_key: true
      t.text :description
      t.float :amount
      t.boolean :is_debit
      t.text :notes
      t.timestamps null: false
    end

    create_table :accounts_events do |t|
      t.references :account, index: true, foreign_key: true
      t.references :event, index: true, foreign_key: true
      t.timestamps null: false
    end

    create_table :categories do |t|
      t.string :title, null: false, unique: true
    end

    create_table :categories_events do |t|
      t.references :category, index: true, foreign_key: true
      t.references :event, index: true, foreign_key: true
    end
  end
end
