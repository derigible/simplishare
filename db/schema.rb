# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160216231221) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "accounts", force: :cascade do |t|
    t.string "name", null: false
  end

  create_table "categories", force: :cascade do |t|
    t.string "title", null: false
  end

  create_table "events", force: :cascade do |t|
    t.integer  "account_id"
    t.text     "description"
    t.float    "amount"
    t.boolean  "is_debit"
    t.text     "notes"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "events", ["account_id"], name: "index_events_on_account_id", using: :btree

  create_table "events_accounts", force: :cascade do |t|
    t.integer  "account_id"
    t.integer  "event_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "events_accounts", ["account_id"], name: "index_events_accounts_on_account_id", using: :btree
  add_index "events_accounts", ["event_id"], name: "index_events_accounts_on_event_id", using: :btree

  create_table "events_categories", force: :cascade do |t|
    t.integer "category_id"
    t.integer "event_id"
  end

  add_index "events_categories", ["category_id"], name: "index_events_categories_on_category_id", using: :btree
  add_index "events_categories", ["event_id"], name: "index_events_categories_on_event_id", using: :btree

  add_foreign_key "events", "accounts"
  add_foreign_key "events_accounts", "accounts"
  add_foreign_key "events_accounts", "events"
  add_foreign_key "events_categories", "categories"
  add_foreign_key "events_categories", "events"
end
