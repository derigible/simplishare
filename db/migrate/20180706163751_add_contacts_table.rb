class AddContactsTable < ActiveRecord::Migration[5.2]
  def change
    create_table :contacts do |t|
      t.references :user, index: true, foreign_key: true
      t.references :contact, index: true, foreign_key: { to_table: :users }, null: true
      t.string :invitation_sent_to
      t.string :authorization_code, unique: true
      t.datetime :authorized_on, null: true
      t.datetime :rejected_on, null: true
      t.datetime :created_at, null: false
    end
  end
end
