# frozen_string_literal: true

module V1::Concerns
  module ShareActions
    def share
      handler.share_or_update_permissions
      handler.mark_as_shared
      respond_with(
        ve.entity.shared_with_except_users(current_user), each_serializer: V1::SharedWithSerializer
      )
    end

    def unshare
      handler.unshare
      head :no_content
    end

    def shared_with
      if handler.cannot_view_shared_with?
        owner_ve.permissions = ['owner']
        respond_with([owner_ve, ve], each_serializer: V1::SharedWithSerializer) and return
      end
      respond_with handler.retrieve_shared_with, each_serializer: V1::SharedWithSerializer
    end

    def shareable_with
      if ve.owner_ve?
        respond_with current_user.contacts_for_serialization, each_serializer: V1::ContactSerializer
      elsif ve.permission?('share')
        respond_with current_user.shared_contacts(owner), each_serializer: V1::ContactSerializer
      else
        render json: []
      end
    end

    private

    def serialize_shared_with
      entity_shared_with.map do |e|
        ActiveModelSerializers::SerializableResource.new(
          e, serializer: V1::SharedWithSerializer
        ).as_json
      end
    end

    def serialize_shareable_with
      entity_shared_with.map do |e|
        ActiveModelSerializers::SerializableResource.new(
          e, serializer: V1::ContactSerializer
        ).as_json
      end
    end

    def entity_shared_with
      if handler.cannot_view_shared_with?
        owner_ve.permissions = ['owner']
        [owner_ve, ve]
      end
      handler.retrieve_shared_with
    end

    def handler
      @handler ||= begin
        d = V1::Handlers::ShareHandler.new(params, current_user)
        authorize(d.virtual_entity)
        d
      end
    end

    def ve
      v = handler.virtual_entity
      authorize v
      v
    end

    def owner
      @owner ||= ve.entity.owner
    end

    def owner_ve
      @owner_ve ||= ve.entity.owner_ve
    end
  end
end
