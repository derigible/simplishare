module DataFixup
  module UpdateArchivedAndPriorityOnTodos
    class Entity < ActiveRecord::Base
      self.inheritance_column = :_type_disabled
    end

    class << self
      def run
        update_archived_and_priority
      end

      private

      def update_archived_and_priority
        Entity.where(type: 'Todo').all.each do |e|
          data = e.data
          archived = data.delete('completed')
          priority = data.delete('priority')
          e.update!(
            archived: archived || false,
            priority: priority || 'medium',
            data: data
          )
        end
      end
    end
  end
end
