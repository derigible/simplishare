module V1
  module Concerns
    module VirtualEntitySharing
      def share
        ve = VirtualEntity.find params[:id]
        authorize(ve)
        share_with_users = User.where(id: share_params[:users].map { |u| u[:id] }.detect { |u_id| u_id != current_user.id })
        already_shared_with_ves = ve.entity.shared_with_except_user(current_user).to_a
        share_with_users.each do |user|
          already_shared_with_ve = already_shared_with_ves.find { |u| share_with_users.find { |swu| u.user_id == swu.id } }
          permissions = share_params[:users].find { |u| u[:id] == user.id }[:permissions]
          if already_shared_with_ve.present?
            ve = VirtualEntity.find_by! user_id: already_shared_with_ve.user_id, entity: ve.entity
            ve.update! metadata: { permissions: permissions }
          else
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
        ves = ve.entity.shared_with_except_user current_user
        respond_with ves, each_serializer: SharedWithSerializer
      end

      def shared_with
        ve = VirtualEntity.find params[:id]
        authorize ve
        ves = ve.entity.shared_with_except_user(current_user)
        respond_with ves, each_serializer: SharedWithSerializer
      end

      private

      def share_params
        params.require(:share).permit(users: [:id, permissions: []])
      end
    end
  end
end
