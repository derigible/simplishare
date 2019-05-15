class RemoveOldBudgetStuff < ActiveRecord::Migration[5.2]
  def change
    remove_index :events_accounts, :account_id
    remove_index :events_accounts, :event_id
    remove_index :events_categories, :category_id
    remove_index :events_categories, :event_id
    remove_index :tags_events, :tag_id
    remove_index :events, :account_id
    remove_index :events, :user_id
    remove_index :categories, :user_id
    remove_index :accounts, :user_id

    remove_foreign_key :accounts, :users
    remove_foreign_key :events, :users
    remove_foreign_key :events, :accounts
    remove_foreign_key :categories, :users
    remove_foreign_key :events_accounts, :accounts
    remove_foreign_key :events_accounts, :events
    remove_foreign_key :events_categories, :categories
    remove_foreign_key :events_categories, :events
    remove_foreign_key :tags_events, :events
    remove_foreign_key :tags_events, :tags

    drop_table :accounts do |t|
      t.string :name, null: false
    end

    drop_table :events do |t|
      t.references :account, index: true, foreign_key: true
      t.text :description
      t.float :amount
      t.boolean :is_debit
      t.text :notes
      t.datetime :date, null: false
      t.timestamps null: false
    end

    drop_table :events_accounts do |t|
      t.references :account, index: true, foreign_key: true
      t.references :event, index: true, foreign_key: true
      t.timestamps null: false
    end

    drop_table :categories do |t|
      t.string :title, null: false
    end

    drop_table :events_categories do |t|
      t.references :category, index: true, foreign_key: true
      t.references :event, index: true, foreign_key: true
    end
  end
end
