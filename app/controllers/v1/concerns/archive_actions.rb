# frozen_string_literal: true

module V1
  module Concerns
    module ArchiveActions
      extend ActiveSupport::Concern

      def archive
        skip_authorization
        update_archived(archive?, request_params[:update_shared])
        SharingMailer.send_archive(current_user, ve)
        respond_with ve, serializer: serializer
      end

      private

      def archive_policy
        @archive_policy ||= virtual_policy.new(current_user, ve)
      end

      def archive?
        request.method != 'DELETE'
      end

      def update_archived(new_archived, update_shared)
        if archive_policy.archive_entity? && update_shared
          ve.entity.update!(archived: new_archived)
        elsif archive_policy.archive?
          ve.update!(archived: new_archived)
        else
          raise Pundit::NotAuthorizedError, query: :update?, record: ve, policy: archive_policy
        end
      end
    end
  end
end
