class RemoveTagsEventsTable < ActiveRecord::Migration[5.2]
  def change
    drop_table :tags_events do |t|
      t.belongs_to :tag, index: true, foreign_key: true
      t.belongs_to :event, index: true, foreign_key: true
    end
  end
end
