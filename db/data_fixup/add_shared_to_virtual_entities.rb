module DataFixup
  module AddSharedToVirtualEntities
    class Entity < ActiveRecord::Base
      self.inheritance_column = :_type_disabled
    end
    class VirtualEntity < ActiveRecord::Base
    end

    class << self
      def run
        entities = Entity.all
        entities.each do |e|
          ves = VirtualEntity.where(entity_id: e.id).to_a
          if ves.size > 1
            ves.select { |ve| ve.shared_on.nil? }.each do |v|
              v.metadata[:shared] = true
              v.save!
            end
          end
        end
      end
    end
  end
end
