# frozen_string_literal: true

module V1
  module Concerns
    module DestroyAction
      extend ActiveSupport::Concern

      def destroy
        skip_authorization
        policy = virtual_policy.new(current_user, ve)
        perform_destroy(policy)
        head :no_content
      end

      private

      def perform_destroy(policy)
        if policy.destroy_entity?
          ve.entity.destroy!
        elsif policy.destroy?
          ve.destroy!
        else
          raise Pundit::NotAuthorizedError, query: :destroy?, record: ve, policy: policy
        end
      end
    end
  end
end
