class RemoveEntitiesTags < ActiveRecord::Migration[5.2]
  def change
    drop_table :entities_tags do |t|
      t.belongs_to :tag, index: true, foreign_key: true
      t.belongs_to :entity, index: true, foreign_key: true
    end
  end
end
