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

ActiveRecord::Schema.define(version: 2019_08_29_185437) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

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
    t.boolean "archived"
    t.string "priority"
    t.index ["type"], name: "index_entities_on_type"
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

  create_table "logins", force: :cascade do |t|
    t.string "identifier", null: false
    t.string "provider", null: false
    t.string "uid", null: false
    t.string "name", null: false
    t.string "email"
    t.string "nickname"
    t.string "first_name"
    t.string "last_name"
    t.string "location"
    t.string "description"
    t.string "url"
    t.string "phone"
    t.jsonb "urls", default: {}
    t.jsonb "credentials", default: {}
    t.jsonb "extra", default: {}
    t.string "password_digest"
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["confirmation_token"], name: "index_logins_on_confirmation_token", unique: true
    t.index ["identifier"], name: "index_logins_on_identifier", unique: true
    t.index ["reset_password_token"], name: "index_logins_on_reset_password_token", unique: true
    t.index ["user_id"], name: "index_logins_on_user_id"
  end

  create_table "notifications", force: :cascade do |t|
    t.jsonb "data", default: {}
    t.boolean "read", default: false
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_notifications_on_user_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "name", null: false
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "email", default: "", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "preferences", default: {}
    t.datetime "locked_at"
    t.integer "failed_attempts"
    t.string "unlock_token"
    t.string "preferred_name"
    t.string "display_name"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["unlock_token"], name: "index_users_on_unlock_token", unique: true
  end

  create_table "virtual_entities", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "entity_id"
    t.datetime "shared_on"
    t.jsonb "metadata", default: {}
    t.boolean "archived"
    t.jsonb "preferences", default: {}
    t.datetime "snooze_until"
    t.boolean "entity_owner", default: false
    t.index ["entity_id"], name: "index_virtual_entities_on_entity_id"
    t.index ["snooze_until"], name: "index_virtual_entities_on_snooze_until"
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

  add_foreign_key "contacts", "users"
  add_foreign_key "contacts", "users", column: "contact_id"
  add_foreign_key "logins", "users"
  add_foreign_key "notifications", "users"
  add_foreign_key "virtual_entities", "entities"
  add_foreign_key "virtual_entities", "users"
  add_foreign_key "virtual_entities_tags", "virtual_entities"
  add_foreign_key "virtual_entities_tags", "virtual_tags"
  add_foreign_key "virtual_tags", "tags"
  add_foreign_key "virtual_tags", "users"
end
