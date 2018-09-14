module DataFixup
  module MigrateToSharedTablesForEntities
    class Entities < ActiveRecord::Base
      self.inheritance_column = 'noop'
    end

    class Tags < ActiveRecord::Base
    end

    class EntitiesTags < ActiveRecord::Base
    end

    class VirtualEntities < ActiveRecord::Base
    end

    class VirtualTags < ActiveRecord::Base
    end

    class VirtualEntitiesTags < ActiveRecord::Base
    end

    class << self
      def run
        migrate_entities
        migrate_tags
        migrate_entities_tags
      end

      private

      def migrate_entities
        Entities.all.each do |r|
          VirtualEntities.create!(
            entity_id: r.id,
            user_id: r.user_id
          )
        end
      end

      def migrate_tags
        Tags.all.each do |r|
          VirtualTags.create!(
            tag_id: r.id,
            user_id: r.user_id
          )
        end
      end

      def migrate_entities_tags
        EntitiesTags.all.each do |r|
          vt = VirtualTag.find_by! tag_id: r.tag_id
          ve = VirtualEntity.find_by! entity_id: r.entity_id
          VirtualEntitiesTags.create!(
            virtual_tag_id: vt.id,
            virtual_entity_id: ve.id
          )
        end
      end
    end
  end
end
