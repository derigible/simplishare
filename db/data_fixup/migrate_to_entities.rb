module DataFixup
  module MigrateToEntities
    class TodoOriginal < ActiveRecord::Base
      self.table_name = 'todos'
    end

    class NoteOriginal < ActiveRecord::Base
      self.table_name = 'notes'
    end

    class Entity < ActiveRecord::Base
      self.table_name = 'entities'
    end

    class Todo < Entity
      def self.sti_name
        'Todo'
      end
    end

    class Note < Entity
      def self.sti_name
        'Note'
      end
    end

    class TagsTodos < ActiveRecord::Base
    end

    class TagsNotes < ActiveRecord::Base
    end

    class EntitiesTags < ActiveRecord::Base
    end

    class << self
      def run
        migrate_todos
        migrate_notes
      end

      private

      def migrate_todos
        TodoOriginal.all.each do |r|
          t = Todo.create!(
            data: r.todo,
            created_at: r.created_at,
            updated_at: r.updated_at,
            user_id: r.user_id
          )
          TagsTodos.where(todo_id: r.id).each do |tag|
            EntitiesTags.create!(
              entity_id: t.id,
              tag_id: tag.tag_id
            )
          end
        end
      end

      def migrate_notes
        NoteOriginal.all.each do |r|
          n = Note.create!(
            data: {
              title: r.title,
              body: r.body
            },
            created_at: r.created_at,
            updated_at: r.updated_at,
            user_id: r.user_id
          )
          TagsNotes.where(note_id: r.id).each do |tag|
            EntitiesTags.create!(
              entity_id: n.id,
              tag_id: tag.tag_id
            )
          end
        end
      end
    end
  end
end
