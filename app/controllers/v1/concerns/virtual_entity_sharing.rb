module V1
  module Concerns
    module VirtualEntitySharing
      def share
        ve = VirtualEntity.find params[:id]
        authorize(ve)
        share_with_user = User.find share_params[:user_id]
        shared = VirtualEntity.new(
          metadata: { permissions: share_params.fetch(:permissions, ['read'])},
          shared_on: Time.zone.now,
          user: share_with_user,
          entity: ve.entity
        )
        shared.shared_on = Time.zone.now
        shared.save!
        head :no_content
      end

      private

      def share_params
        params.require(:share).permit(:user_id, permissions: [])
      end
    end
  end
end
