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

ActiveRecord::Schema.define(version: 2018_09_08_030234) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "accounts", force: :cascade do |t|
    t.string "name", null: false
    t.bigint "user_id"
    t.index ["user_id"], name: "index_accounts_on_user_id"
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "categories", force: :cascade do |t|
    t.string "title", null: false
    t.bigint "user_id"
    t.index ["user_id"], name: "index_categories_on_user_id"
  end

  create_table "contacts", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "contact_id"
    t.string "invitation_sent_to"
    t.string "authorization_code"
    t.datetime "authorized_on"
    t.datetime "rejected_on"
    t.datetime "created_at", null: false
    t.index ["contact_id"], name: "index_contacts_on_contact_id"
    t.index ["user_id"], name: "index_contacts_on_user_id"
  end

  create_table "delayed_jobs", id: :serial, force: :cascade do |t|
    t.integer "priority", default: 0
    t.integer "attempts", default: 0
    t.text "handler"
    t.text "last_error"
    t.string "queue", limit: 255
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string "locked_by", limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "tag", limit: 255
    t.integer "max_attempts"
    t.string "strand", limit: 255
    t.boolean "next_in_strand", default: true, null: false
    t.string "source", limit: 255
    t.integer "max_concurrent", default: 1, null: false
    t.datetime "expires_at"
    t.index ["locked_by"], name: "index_delayed_jobs_on_locked_by", where: "(locked_by IS NOT NULL)"
    t.index ["priority", "run_at", "queue"], name: "get_delayed_jobs_index", where: "((locked_at IS NULL) AND (next_in_strand = true))"
    t.index ["run_at", "tag"], name: "index_delayed_jobs_on_run_at_and_tag"
    t.index ["strand", "id"], name: "index_delayed_jobs_on_strand"
    t.index ["tag"], name: "index_delayed_jobs_on_tag"
  end

  create_table "entities", force: :cascade do |t|
    t.jsonb "data", default: {}
    t.string "type", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["type"], name: "index_entities_on_type"
  end

  create_table "events", force: :cascade do |t|
    t.bigint "account_id"
    t.text "description"
    t.float "amount"
    t.boolean "is_debit"
    t.text "notes"
    t.datetime "date", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.index ["account_id"], name: "index_events_on_account_id"
    t.index ["user_id"], name: "index_events_on_user_id"
  end

  create_table "events_accounts", force: :cascade do |t|
    t.bigint "account_id"
    t.bigint "event_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_events_accounts_on_account_id"
    t.index ["event_id"], name: "index_events_accounts_on_event_id"
  end

  create_table "events_categories", force: :cascade do |t|
    t.bigint "category_id"
    t.bigint "event_id"
    t.index ["category_id"], name: "index_events_categories_on_category_id"
    t.index ["event_id"], name: "index_events_categories_on_event_id"
  end

  create_table "failed_jobs", id: :serial, force: :cascade do |t|
    t.integer "priority", default: 0
    t.integer "attempts", default: 0
    t.string "handler", limit: 512000
    t.text "last_error"
    t.string "queue", limit: 255
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string "locked_by", limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "tag", limit: 255
    t.integer "max_attempts"
    t.string "strand", limit: 255
    t.bigint "original_job_id"
    t.string "source", limit: 255
    t.datetime "expires_at"
  end

  create_table "tags", force: :cascade do |t|
    t.string "name", null: false
  end

  create_table "tags_events", force: :cascade do |t|
    t.bigint "tag_id"
    t.bigint "event_id"
    t.index ["event_id"], name: "index_tags_events_on_event_id"
    t.index ["tag_id"], name: "index_tags_events_on_tag_id"
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.string "full_name"
    t.string "username"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  create_table "virtual_entities", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "entity_id"
    t.datetime "shared_on"
    t.jsonb "metadata", default: {}
    t.index ["entity_id"], name: "index_virtual_entities_on_entity_id"
    t.index ["user_id"], name: "index_virtual_entities_on_user_id"
  end

  create_table "virtual_entities_tags", force: :cascade do |t|
    t.bigint "virtual_tag_id"
    t.bigint "virtual_entity_id"
    t.index ["virtual_entity_id"], name: "index_virtual_entities_tags_on_virtual_entity_id"
    t.index ["virtual_tag_id"], name: "index_virtual_entities_tags_on_virtual_tag_id"
  end

  create_table "virtual_tags", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "tag_id"
    t.datetime "shared_on"
    t.jsonb "metadata", default: {}
    t.index ["tag_id"], name: "index_virtual_tags_on_tag_id"
    t.index ["user_id"], name: "index_virtual_tags_on_user_id"
  end

  add_foreign_key "accounts", "users"
  add_foreign_key "categories", "users"
  add_foreign_key "contacts", "users"
  add_foreign_key "contacts", "users", column: "contact_id"
  add_foreign_key "events", "accounts"
  add_foreign_key "events", "users"
  add_foreign_key "events_accounts", "accounts"
  add_foreign_key "events_accounts", "events"
  add_foreign_key "events_categories", "categories"
  add_foreign_key "events_categories", "events"
  add_foreign_key "tags_events", "events"
  add_foreign_key "tags_events", "tags"
  add_foreign_key "virtual_entities", "entities"
  add_foreign_key "virtual_entities", "users"
  add_foreign_key "virtual_entities_tags", "virtual_entities"
  add_foreign_key "virtual_entities_tags", "virtual_tags"
  add_foreign_key "virtual_tags", "tags"
  add_foreign_key "virtual_tags", "users"
end
