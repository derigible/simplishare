# frozen_string_literal: true

module V1
  module Concerns
    module ArchiveActions
      extend ActiveSupport::Concern

      def archive
        skip_authorization
        policy = virtual_policy.new(current_user, ve)
        update_archived(policy, true, request_params[:update_shared])
        send_archive_email(true)
        respond_with ve, serializer: serializer
      end

      def unarchive
        skip_authorization
        policy = virtual_policy.new(current_user, ve)
        update_archived(policy, true, request_params[:update_shared])
        send_archive_email(false)
        respond_with ve, serializer: serializer
      end

      private

      def perform_archive(policy)
        update_archived(policy, request_params[:archived], request_params[:update_shared])
      end

      def send_archive_email(archive)
        SharingMailer.send_archive(current_user, ve) if archive
        SharingMailer.send_unarchive(current_user, ve) unless archive
      end

      def update_archived(policy, new_archived, update_shared)
        if policy.archive_entity? && update_shared
          ve.entity.update!(archived: new_archived)
        elsif policy.archive?
          ve.update!(archived: new_archived)
        else
          raise Pundit::NotAuthorizedError, query: :update?, record: ve, policy: policy
        end
      end
    end
  end
end
