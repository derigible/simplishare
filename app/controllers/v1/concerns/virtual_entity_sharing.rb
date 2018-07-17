module V1
  module Concerns
    module VirtualEntitySharing
      def share
        ve = VirtualEntity.find params[:id]
        authorize(ve)
        share_with_users = User.where(id: share_params[:users].map { |u| u[:id] }.detect { |u_id| u_id != current_user.id })
        share_with_users.each do |user|
          shared = VirtualEntity.new(
            metadata: { permissions: share_params[:users].find { |u| u[:id] == user.id }[:permissions]},
            shared_on: Time.zone.now,
            user: user,
            entity: ve.entity
          )
          shared.shared_on = Time.zone.now
          shared.save!
        end
        ves = ve.entity.shared_with_except_user(current_user)
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
