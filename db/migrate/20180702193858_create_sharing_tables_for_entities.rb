class CreateSharingTablesForEntities < ActiveRecord::Migration[5.2]
  def change
    create_table :virtual_tags do |t|
      t.references :user, index: true, foreign_key: true
      t.references :tag, index: true, foreign_key: true
      t.datetime :shared_on, null: true
      t.jsonb :metadata, default: {}
    end

    create_table :virtual_entities do |t|
      t.references :user, index: true, foreign_key: true
      t.references :entity, index: true, foreign_key: true
      t.datetime :shared_on, null: true
      t.jsonb :metadata, default: {}
    end

    create_table :virtual_entities_tags do |t|
      t.references :virtual_tag, index: true, foreign_key: true
      t.references :virtual_entity, index: true, foreign_key: true
    end
  end
end
