# frozen_string_literal: true

module V1
  module Concerns
    module IndexAction
      extend ActiveSupport::Concern

      def index
        virtual_entities = paginate index_scope.eager_load(:virtual_tags).select("virtual_tags.id")
        respond_with virtual_entities, each_serializer: serializer
      end

      private

      def index_scope
        scope = index_filter policy_scope(entity_model).unsnoozed
        scope = params[:archived] ? archived_index_scope(scope) : unarchived_index_scope(scope)
        scope
      end

      def archived_index_scope(scope)
        pre_archived_scope = scope
        scope = scope.archived
        scope.or(
          pre_archived_scope.where(
            entity: Entity.where(id: pre_archived_scope.select(:entity_id), archived: true)
          )
        )
      end

      def unarchived_index_scope(scope)
        scope = scope.unarchived
        scope.where.not(id: scope.where(
          entity: Entity.where(id: scope.select(:entity_id), archived: true)
        ).select(:id))
      end

      def index_filter(scope)
        scope
      end
    end
  end
end
