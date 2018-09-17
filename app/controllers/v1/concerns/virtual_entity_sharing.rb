# frozen_string_literal: true

module V1
  module Concerns
    module VirtualEntitySharing
      def share
        delegate.share_or_update_permissions
        delegate.mark_as_shared
        respond_with virtual_entity.entity.shared_with_except_users(current_user), each_serializer: SharedWithSerializer
      end

      def shared_with
        if delegate.can_view_shared_with?
          owner_ve = virtual_entity.entity.owner_ve
          owner_ve.metadata['permissions'] = ['owner']
          respond_with([owner_ve, virtual_entity], each_serializer: V1::Detailed::SharedWithSerializer) and return
        end
        respond_with delegate.retrieve_shared_with, each_serializer: SharedWithSerializer
      end

      def shareable_with
        if virtual_entity.owner_ve?
          respond_with current_user.contacts_for_serialization, each_serializer: ContactSerializer
        else
          owner = virtual_entity.entity.owner
          respond_with current_user.shared_contacts(owner), each_serializer: ContactSerializer
        end
      end

      private

      def delegate
        @delegate ||= begin
          d = ShareDelegate.new(params, current_user)
          authorize(d.virtual_entity)
          d
        end
      end

      def virtual_entity
        delegate.virtual_entity
      end
    end
  end
end
