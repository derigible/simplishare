class CreateV1Accounts < ActiveRecord::Migration[5.1]
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
      t.datetime :date, null: false
      t.timestamps null: false
    end

    create_table :events_accounts do |t|
      t.references :account, index: true, foreign_key: true
      t.references :event, index: true, foreign_key: true
      t.timestamps null: false
    end

    create_table :categories do |t|
      t.string :title, null: false, unique: true
    end

    create_table :events_categories do |t|
      t.references :category, index: true, foreign_key: true
      t.references :event, index: true, foreign_key: true
    end
  end
end
