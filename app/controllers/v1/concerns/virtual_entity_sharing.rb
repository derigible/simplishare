# frozen_string_literal: true

module V1::Concerns
  module VirtualEntitySharing
    def share
      delegate.share_or_update_permissions
      delegate.mark_as_shared
      respond_with(
        virtual_entity.entity.shared_with_except_users(current_user), each_serializer: V1::SharedWithSerializer
      )
    end

    def shared_with
      if delegate.cannot_view_shared_with?
        owner_ve.permissions = ['owner']
        respond_with([owner_ve, virtual_entity], each_serializer: V1::Detailed::SharedWithSerializer) and return
      end
      respond_with delegate.retrieve_shared_with, each_serializer: V1::SharedWithSerializer
    end

    def shareable_with
      if virtual_entity.owner_ve?
        respond_with current_user.contacts_for_serialization, each_serializer: V1::ContactSerializer
      elsif virtual_entity.permission?('share')
        respond_with current_user.shared_contacts(owner), each_serializer: V1::ContactSerializer
      else
        render json: []
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

    def owner
      @owner ||= virtual_entity.entity.owner
    end

    def owner_ve
      @owner_ve ||= virtual_entity.entity.owner_ve
    end
  end
end
