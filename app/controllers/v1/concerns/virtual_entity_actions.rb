# frozen_string_literal: true

module V1
  module Concerns
    module VirtualEntityActions
      extend ActiveSupport::Concern

      def index
        virtual_entities = paginate index_scope.eager_load(:virtual_tags).select("virtual_tags.id")
        respond_with virtual_entities, each_serializer: serializer
      end

      def create
        entity = entity_model.new(create_params)
        ve = VirtualEntity.new(user: current_user)
        authorize ve
        entity.save!
        ve.entity = entity
        ve.save
        respond_with ve, status: :created, serializer: serializer
      end

      def show
        authorize(@ve)
        respond_with @ve, serializer: serializer
      end

      def update
        perform_update
        send_update_email
        respond_with @ve, serializer: serializer
      end

      def archive
        skip_authorization
        policy = VirtualEntityPolicy.new(current_user, @ve)
        perform_archive(policy)
        send_archive_email
        respond_with @ve, serializer: serializer
      end

      def destroy
        skip_authorization
        policy = VirtualEntityPolicy.new(current_user, @ve)
        if policy.destroy_entity?
          @ve.entity.destroy!
        elsif policy.destroy?
          @ve.destroy!
        else
          raise Pundit::NotAuthorizedError, query: :destroy?, record: @ve, policy: policy
        end
        head :no_content
      end

      def snooze
        authorize(@ve)
        @ve.update(snooze_params)
        @ve.save
        respond_with @ve, serializer: serializer
      end

      included do
        before_action :load_virtual_entity, except: %i[index create]
      end

      private

      def perform_update
        authorize(@ve)
        @ve.entity.update!(update_params)
      end

      def send_update_email
        SharingMailer.send_update(current_user, @ve.entity)
      end

      def perform_archive(policy)
        update_archived(policy, request_params[:archived], request_params[:update_shared])
      end

      def send_archive_email
        SharingMailer.send_archive(current_user, @ve)
      end

      def entity_model
        raise 'Must define on controller'
      end

      def create_params
        raise 'Must define on controller'
      end

      def load_virtual_entity
        @ve = VirtualEntity.find(params[:id])
      end

      def index_scope
        scope = index_filter policy_scope(entity_model).unsnoozed
        scope = params[:archived] ? archived_index_scope(scope) : unarchived_index_scope(scope)
        scope
      end

      def archived_index_scope(scope)
        pre_archived_scope = scope
        scope = scope.archived
        scope.or(pre_archived_scope.where(entity: Entity.where(id: pre_archived_scope.select(:entity_id), archived: true)))
      end

      def unarchived_index_scope(scope)
        scope = scope.unarchived
        scope.where.not(id: scope.where(entity: Entity.where(id: scope.select(:entity_id), archived: true)).select(:id))
      end

      def index_filter(scope)
        scope
      end

      # Update functions

      def request_params
        raise 'Must define on controller'
      end

      def update_params
        raise 'Must define on controller'
      end

      def snooze_params
        params.require(:snooze).permit(:snooze_until)
      end

      def update_archived(policy, new_archived, update_shared)
        if policy.archive_entity? && update_shared
          @ve.entity.update!(archived: new_archived)
        elsif policy.archive?
          @ve.update!(archived: new_archived)
        else
          raise Pundit::NotAuthorizedError, query: :update?, record: @ve, policy: policy
        end
      end
    end
  end
end
