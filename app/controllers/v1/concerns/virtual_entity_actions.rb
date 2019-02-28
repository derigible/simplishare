# frozen_string_literal: true

module V1
  module Concerns
    module VirtualEntityActions
      extend ActiveSupport::Concern

      def index
        virtual_entities = paginate index_filter(index_scope)
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
        skip_authorization
        perform_update unless archive_only?
        update_archived_if_requested
        send_update_notifications
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
        policy_scope(entity_model).unsnoozed.eager_load(:virtual_tags).select("virtual_tags.id")
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

      def perform_update
        authorize(@ve)
        @ve.entity.update!(update_params)
      end

      def update_archived_requested?
        !request_params[:archived].nil?
      end

      def update_archived_on_shared_requested?
        !request_params[:update_shared].nil?
      end

      def archive_only?
        update_archived_requested? && (
          request_params.keys.size == 1 ||
          (request_params.keys.size == 2 && update_archived_on_shared_requested?)
        )
      end

      def update_archived_if_requested
        return unless update_archived_requested?
        policy = VirtualEntityPolicy.new(current_user, @ve)
        update_archived(policy, request_params[:archived], request_params[:update_shared])
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

      def send_update_notifications
        if archive_only?
          SharingMailer.send_archive(current_user, @ve)
        elsif update_archived_requested?
          SharingMailer.send_archive_and_update(current_user, @ve)
        else
          SharingMailer.send_update(current_user, @ve.entity)
        end
      end
    end
  end
end
