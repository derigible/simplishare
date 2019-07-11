class CreateLogins < ActiveRecord::Migration[5.2]
  def change
    create_table :logins do |t|
      # used to uniquely id a login (usually a concat of provider:uid)
      t.string :identifier, null: false
      t.index :identifier, unique: true

      t.string :provider, null: false
      t.string :uid, null: false
      t.string :name, null: false
      t.string :email
      t.string :nickname
      t.string :first_name
      t.string :last_name
      t.string :location
      t.string :description
      t.string :url
      t.string :phone
      t.jsonb :urls, default: {}
      t.jsonb :credentials, default: {}
      t.jsonb :extra, default: {}

      # for password auth
      t.string :password_digest

      t.belongs_to :user, index: true, foreign_key: true, null: false
    end
  end
end
