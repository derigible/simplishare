module V1
  module Concerns
    module VirtualEntitySharing
      def share
        ve = VirtualEntity.find params[:id]
        authorize(ve)
        share_with_users = User.where(id: share_params[:users].map { |u| u[:id] }.select { |u_id| u_id != current_user.id })
        already_shared_with_ves = ve.entity.shared_with_except_users(current_user).to_a
        debugger
        share_with_users.each do |user|
          debugger
          already_shared_with_ve = already_shared_with_ves.find { |u| user.id == u.id }
          permissions = share_params[:users].find { |u| u[:id] == user.id }[:permissions]
          if already_shared_with_ve.present? && permissions.exclude?('owner')
            ve = VirtualEntity.find_by! user_id: already_shared_with_ve.user_id, entity: ve.entity
            ve.update! metadata: { permissions: permissions }
          elsif permissions.exclude?('owner')
            ve = VirtualEntity.new(
              metadata: { permissions: permissions },
              shared_on: Time.zone.now,
              user: user,
              entity: ve.entity
            )
            ve.shared_on = Time.zone.now
            ve.save!
          end
        end
        ves = ve.entity.shared_with_except_users current_user
        respond_with ves, each_serializer: SharedWithSerializer
      end

      def shared_with
        ve = VirtualEntity.find params[:id]
        authorize ve
        if (!ve.owner_ve? && ve.metadata['permissions'].exclude?('share'))
          owner_ve = ve.entity.owner_ve
          owner_ve.metadata['permissions'] = ['owner']
          respond_with [owner_ve, ve], each_serializer: V1::Detailed::SharedWithSerializer and return
        end

        ves = if !ve.owner_ve?
          owner_ve = ve.entity.owner_ve
          vs = ve.entity.shared_with_except_users([current_user, owner_ve.user]).to_a
          owner_ve.metadata['permissions'] = ['owner']
          vs << owner_ve
          filtered_by_shared_contacts(vs, owner_ve.user_id)
        else
          ve.entity.shared_with_except_users([current_user])
        end
        respond_with ves, each_serializer: SharedWithSerializer
      end

      def shareable_with
        ve = VirtualEntity.find params[:id]
        authorize ve
        if ve.owner_ve?
          respond_with current_user.contacts_for_serialization, each_serializer: ContactSerializer
        else
          owner = ve.entity.owner
          respond_with current_user.shared_contacts(owner), each_serializer: ContactSerializer
        end
      end

      private

      def share_params
        params.require(:share).permit(users: [:id, permissions: []])
      end

      def filtered_by_shared_contacts(vs, except_id)
        contact_ids = current_user.contacts.pluck(:user_id, :contact_id).flatten
        vs.each_with_object([]) do |v, memo|
          memo << v if v.user_id == except_id || contact_ids.include?(v.user_id)
        end
      end
    end
  end
end
